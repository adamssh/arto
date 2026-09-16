export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-surface rounded-xl2 shadow-soft p-5 border border-white/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
