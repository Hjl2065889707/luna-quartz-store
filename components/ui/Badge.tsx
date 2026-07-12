import * as React from 'react'
import { cn } from './Button'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-rose-clay focus:ring-offset-2'

  const variants = {
    default: 'bg-charcoal-cocoa text-white hover:bg-charcoal-cocoa/80',
    secondary: 'bg-white/90 text-soft-taupe backdrop-blur shadow-sm hover:bg-white',
    outline: 'border border-mist-gray text-charcoal-cocoa',
    destructive: 'bg-deep-rose text-white hover:bg-deep-rose/80',
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  )
}

export { Badge }
