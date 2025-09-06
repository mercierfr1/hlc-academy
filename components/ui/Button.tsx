import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...props }, ref) => {
    const baseClasses = cn(
      'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'h-10 px-4 text-sm': size === 'sm',
        'h-12 px-6 text-sm': size === 'md',
        'h-14 px-8 text-base': size === 'lg',
        'button-primary': variant === 'primary',
        'button-secondary': variant === 'secondary',
        'h-12 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': variant === 'ghost',
      },
      className
    )

    if (asChild) {
      return (
        <div className={baseClasses}>
          {children}
        </div>
      )
    }
    
    return (
      <button
        className={baseClasses}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }