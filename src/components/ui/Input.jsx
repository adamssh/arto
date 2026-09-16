import { forwardRef } from 'react';

const Input = forwardRef(({ className = '', label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-medium text-text-primary ml-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
          error ? 'border-expense/50 focus:border-expense focus:ring-expense/20' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-expense ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;

