import React, { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            className={`
              w-4 h-4 rounded border-gray-300 text-blue-600 
              focus:ring-blue-500 focus:ring-offset-0
              dark:border-gray-600 dark:bg-slate-800
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            {...props}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        </label>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;