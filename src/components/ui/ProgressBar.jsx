export default function ProgressBar({ progress, className = '', color = 'bg-primary' }) {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full h-3 bg-beige/40 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}

