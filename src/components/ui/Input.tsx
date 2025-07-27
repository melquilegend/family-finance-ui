import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            block w-full rounded-md border border-border 
            bg-background px-3 py-2.5 text-foreground
            placeholder-muted-foreground
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border'}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;