import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

// Custom Label component since shadcn Label is missing
const Label = ({ className, children, ...props }: any) => (
  <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-300", className)} {...props}>{children}</label>
);

const BaseLabel = Label; // Alias for compatibility with existing code

// Fallback Input wrapper if needed, but we imported Input
const BaseInput = React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      "flex h-12 w-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all",
      className
    )}
    ref={ref}
    {...props}
  />
));
BaseInput.displayName = "BaseInput";

interface ProfileFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const ProfileField = React.forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <BaseLabel>{label}</BaseLabel>
        <BaseInput 
          ref={ref} 
          className={cn(error && "border-red-500 focus-visible:ring-red-500/50", className)} 
          {...props} 
        />
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
ProfileField.displayName = "ProfileField";

interface ProfileTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const ProfileTextArea = React.forwardRef<HTMLTextAreaElement, ProfileTextAreaProps>(
    ({ label, error, helperText, className, ...props }, ref) => {
      return (
        <div className="space-y-2">
          <BaseLabel>{label}</BaseLabel>
          <textarea
            ref={ref}
            className={cn(
              "flex min-h-[120px] w-full rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all resize-y",
              error && "border-red-500 focus-visible:ring-red-500/50",
              className
            )}
            {...props}
          />
          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
          {helperText && !error && <p className="text-xs text-gray-500">{helperText}</p>}
        </div>
      );
    }
  );
ProfileTextArea.displayName = "ProfileTextArea";

interface ProfileSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const ProfileSelect = React.forwardRef<HTMLSelectElement, ProfileSelectProps>(
    ({ label, error, options, className, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <BaseLabel>{label}</BaseLabel>
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            "flex h-12 w-full appearance-none rounded-xl border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50 text-white transition-all",
                            error && "border-red-500",
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled className="bg-gray-800 text-gray-500">Select {label}</option>
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-gray-800 text-white">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {/* Custom Chevron */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
            </div>
        )
    }
);
ProfileSelect.displayName = "ProfileSelect";
