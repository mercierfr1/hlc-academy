import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  centered?: boolean
}

const SectionHeading = forwardRef<HTMLDivElement, SectionHeadingProps>(
  ({ title, subtitle, centered = true, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'space-y-4',
        centered ? 'text-center' : 'text-left',
        className
      )}
      {...props}
    >
      <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </div>
  )
)
SectionHeading.displayName = 'SectionHeading'

export { SectionHeading }
