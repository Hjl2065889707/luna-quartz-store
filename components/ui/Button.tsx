import * as React from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

import Link from 'next/link'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  href?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', href, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-bold ring-offset-moon-ivory transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-clay focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95'

    const variants = {
      primary: 'bg-charcoal-cocoa text-white hover:bg-[#4A3732] shadow-sm',
      secondary: 'bg-warm-white text-charcoal-cocoa hover:bg-mist-gray shadow-sm',
      outline: 'border border-mist-gray bg-transparent text-charcoal-cocoa hover:border-rose-clay hover:bg-warm-white/50',
      ghost: 'text-charcoal-cocoa hover:bg-mist-gray/50 hover:text-charcoal-cocoa',
    }

    const sizes = {
      default: 'h-11 px-6 py-2',
      sm: 'h-9 px-4 text-xs',
      lg: 'h-12 px-8 text-base',
      icon: 'h-11 w-11',
    }
    
    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className)

    if (href) {
      return (
        <Link href={href} className={combinedClassName}>
          {props.children}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        className={combinedClassName}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, cn }
