import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility to merge tailwind classes */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    
    // Size classes
    const sizeClasses = {
      default: 'h-12 px-8',
      sm: 'h-10 px-6',
      lg: 'h-14 px-10',
    };

    // Base classes
    const baseClasses = 'group relative overflow-hidden inline-flex items-center justify-center uppercase text-xs tracking-[0.2em] font-medium transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1A1A1A] disabled:opacity-50 disabled:pointer-events-none rounded-none';

    // Variant classes
    const variantClasses = {
      primary: 'bg-[#1A1A1A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)]',
      secondary: 'bg-transparent border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white',
      ghost: 'bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A]/5',
      link: 'bg-transparent text-[#1A1A1A] hover:text-[#D4AF37] px-0 h-auto underline-offset-4 hover:underline',
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], variant !== 'link' && sizeClasses[size], className)}
        {...props}
      >
        {variant === 'primary' && (
          <span 
            className="absolute inset-0 bg-[#D4AF37] -translate-x-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-0" 
            aria-hidden="true" 
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';
