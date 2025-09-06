import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto max-w-7xl px-6 sm:px-8', className)}
      {...props}
    />
  )
)
Container.displayName = 'Container'

export { Container }
