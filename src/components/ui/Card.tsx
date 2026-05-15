import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-2xl border border-zinc-800 bg-zinc-900 p-4', className)}>
      {children}
    </div>
  )
}
