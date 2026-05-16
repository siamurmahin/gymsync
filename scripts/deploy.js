#!/usr/bin/env node
/**
 * Deploy script for gymsync → gymsync.websylime.com
 *
 * Setup (one time):
 *   1. npm install --save-dev node-ssh
 *   2. Create .deploy.env in project root with:
 *        SSH_PASSWORD=your_cpanel_password
 *
 * Usage:
 *   node scripts/deploy.js           # build + deploy
 *   node scripts/deploy.js --no-build  # deploy current .next without rebuilding
 */

const { NodeSSH } = require('node-ssh');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────

const SSH = {
  host: 'server234.web-hosting.com',
  username: 'websflku',
  port: 21098,
  // password loaded from .deploy.env
};

const REMOTE_BASE = '/home/websflku/gymsync.websylime.com';
const LOCAL_BASE = path.join(__dirname, '..');

// Directories to upload (relative to LOCAL_BASE → REMOTE_BASE)
const UPLOAD_DIRS = [
  '.next/server',
  '.next/static',
  '.next/build',
];

// Individual files to upload (relative to LOCAL_BASE → REMOTE_BASE)
const UPLOAD_FILES = [
  '.next/BUILD_ID',
  '.next/build-manifest.json',
  '.next/app-path-routes-manifest.json',
  '.next/routes-manifest.json',
  '.next/prerender-manifest.json',
  '.next/required-server-files.json',
  '.next/required-server-files.js',
  '.next/export-marker.json',
  '.next/fallback-build-manifest.json',
  '.next/images-manifest.json',
  '.next/next-server.js.nft.json',
  '.next/package.json',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadEnv() {
  const envFile = path.join(LOCAL_BASE, '.deploy.env');
  if (!fs.existsSync(envFile)) {
    console.error('\n❌ Missing .deploy.env — create it with: SSH_PASSWORD=your_password\n');
    process.exit(1);
  }
  const lines = fs.readFileSync(envFile, 'utf8').split('\n');
  for (const line of lines) {
    const [key, ...rest] = line.split('=');
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim();
  }
  if (!process.env.SSH_PASSWORD) {
    console.error('\n❌ SSH_PASSWORD not found in .deploy.env\n');
    process.exit(1);
  }
}

function getAllFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) results.push(...getAllFiles(fullPath));
    else results.push(fullPath);
  }
  return results;
}

function getAllDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.isDirectory()) {
      const fullPath = path.join(dir, item.name);
      results.push(fullPath);
      results.push(...getAllDirs(fullPath));
    }
  }
  return results;
}

function localToRemote(localPath) {
  return REMOTE_BASE + '/' + localPath.replace(LOCAL_BASE + path.sep, '').replace(/\\/g, '/');
}

async function mkdirp(sftp, remotePath) {
  // Create dir + all parents
  const parts = remotePath.split('/').filter(Boolean);
  let current = '';
  for (const part of parts) {
    current += '/' + part;
    await new Promise((resolve) => {
      sftp.mkdir(current, (err) => resolve()); // ignore errors (already exists)
    });
  }
}

function sftpPut(sftp, local, remote) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(local, remote, (err) => (err ? reject(err) : resolve()));
  });
}

async function uploadDir(sftp, localDir, label) {
  const allDirs = getAllDirs(localDir);
  const allFiles = getAllFiles(localDir);

  process.stdout.write(`  Creating ${allDirs.length} dirs...`);
  for (const d of allDirs) {
    const remote = localToRemote(d);
    await new Promise((resolve) => sftp.mkdir(remote, () => resolve()));
  }
  console.log(' done');

  process.stdout.write(`  Uploading ${allFiles.length} files...`);
  let ok = 0, fail = 0;
  for (const f of allFiles) {
    try {
      await sftpPut(sftp, f, localToRemote(f));
      ok++;
    } catch {
      fail++;
    }
  }
  console.log(` ${ok} OK${fail ? `, ${fail} failed` : ''}`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const noBuild = process.argv.includes('--no-build');

  loadEnv();

  // 1. Build
  if (!noBuild) {
    console.log('\n📦 Building...');
    try {
      execSync('npm run build', { cwd: LOCAL_BASE, stdio: 'inherit' });
    } catch {
      console.error('❌ Build failed. Fix errors and retry.');
      process.exit(1);
    }
  } else {
    console.log('\n⏭  Skipping build (--no-build)');
  }

  // Verify .next exists
  if (!fs.existsSync(path.join(LOCAL_BASE, '.next', 'BUILD_ID'))) {
    console.error('\n❌ .next/BUILD_ID not found — run without --no-build\n');
    process.exit(1);
  }

  // 2. Connect
  console.log('\n🔌 Connecting to server...');
  const ssh = new NodeSSH();
  await ssh.connect({ ...SSH, password: process.env.SSH_PASSWORD });
  console.log('   Connected');

  const sftp = await ssh.requestSFTP();

  // 3. Upload directories
  for (const dir of UPLOAD_DIRS) {
    const localDir = path.join(LOCAL_BASE, dir.replace(/\//g, path.sep));
    if (!fs.existsSync(localDir)) {
      console.log(`  ⚠  ${dir} not found locally, skipping`);
      continue;
    }
    console.log(`\n📁 ${dir}/`);

    // Ensure remote dir exists
    const remoteDir = REMOTE_BASE + '/' + dir;
    await mkdirp(sftp, remoteDir);

    await uploadDir(sftp, localDir, dir);
  }

  // 4. Upload individual files
  console.log('\n📄 Root manifests...');
  let manifestOk = 0;
  for (const rel of UPLOAD_FILES) {
    const local = path.join(LOCAL_BASE, rel.replace(/\//g, path.sep));
    if (!fs.existsSync(local)) continue;
    const remote = REMOTE_BASE + '/' + rel;
    try {
      await sftpPut(sftp, local, remote);
      manifestOk++;
    } catch (e) {
      console.log(`  ⚠  ${rel}: ${e.message}`);
    }
  }
  console.log(`  ${manifestOk} files uploaded`);

  // 5. Fix permissions
  console.log('\n🔧 Fixing permissions...');
  await ssh.execCommand(`find ${REMOTE_BASE}/.next -type d -exec chmod 755 {} \\;`);
  await ssh.execCommand(`find ${REMOTE_BASE}/.next -type f -exec chmod 644 {} \\;`);

  // 6. Ensure _next symlink (LiteSpeed static file serving)
  console.log('\n🔗 Ensuring _next symlink...');
  await ssh.execCommand(`ln -sfn ${REMOTE_BASE}/.next ${REMOTE_BASE}/_next`);

  // 7. Kill old lsnode process (LiteSpeed will restart it fresh)
  console.log('\n♻  Restarting app...');
  const kill = await ssh.execCommand(
    `kill $(ps aux | grep "lsnode:${REMOTE_BASE}" | grep -v grep | awk '{print $2}') 2>/dev/null; echo "done"`
  );
  console.log('  ', kill.stdout.trim());

  // 8. Wait and health check
  console.log('\n⏳ Waiting 8s for restart...');
  await new Promise((r) => setTimeout(r, 8000));

  console.log('\n✅ Health check:');
  const checks = ['/', '/login', '/signup', '/_next/static/chunks/04_i9i5onkeeb.css'];
  for (const url of checks) {
    const r = await ssh.execCommand(
      `curl -s -o /dev/null -w "${url} → %{http_code}" https://gymsync.websylime.com${url}`
    );
    console.log(' ', r.stdout);
  }

  ssh.dispose();
  console.log('\n🚀 Deploy complete! https://gymsync.websylime.com\n');
}

main().catch((err) => {
  console.error('\n❌ Deploy failed:', err.message);
  process.exit(1);
});
