import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'featured' | 'image';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    
    // Base classes
    const baseClasses = 'group bg-transparent transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]';

    // Variant classes
    const variantClasses = {
      default: 'border-t border-[#1A1A1A] p-8 md:p-12 hover:bg-[#F9F8F6]/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]',
      featured: 'border-t-4 border-[#D4AF37] p-8 md:p-12 shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] bg-white/50',
      image: 'relative overflow-hidden aspect-[3/4] shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
    };

    return (
      <div 
        ref={ref} 
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
