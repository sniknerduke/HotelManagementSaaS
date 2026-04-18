import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {label && (
          <label className="block uppercase text-[10px] tracking-[0.25em] text-[#6C6863] mb-2 font-sans font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-12 bg-transparent border-b border-[#1A1A1A]/20 px-0 py-2 text-sm text-[#1A1A1A]',
            'font-sans transition-colors duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            'placeholder:font-serif placeholder:italic placeholder:text-[#6C6863]',
            'focus-visible:outline-none focus:border-[#D4AF37]',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 font-sans">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
