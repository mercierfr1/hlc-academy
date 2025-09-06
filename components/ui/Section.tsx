import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  className?: string
}

const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('py-20 sm:py-28 lg:py-32', className)}
      {...props}
    >
      {children}
    </section>
  )
)
Section.displayName = 'Section'

export { Section }
