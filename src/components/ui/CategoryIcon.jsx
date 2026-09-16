import * as LucideIcons from 'lucide-react';

export default function CategoryIcon({ colorString, size = 'md', className = '' }) {
  // Parse the packed string "colorName:IconName"
  const [colorName, iconName] = (colorString || 'sage').split(':');
  
  // Resolve the Lucide icon
  const IconComponent = LucideIcons[iconName] || LucideIcons.Circle;

  // Determine dimensions based on size
  const containerClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl2',
  }[size] || 'w-10 h-10 rounded-xl';

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size] || 20;

  return (
    <div 
      className={`${containerClasses} flex items-center justify-center bg-${colorName} shrink-0 ${className}`}
    >
      {iconName ? (
        <IconComponent size={iconSize} className="text-surface/80" strokeWidth={2.5} />
      ) : (
        <div className="w-4 h-4 bg-white/40 rounded-full" />
      )}
    </div>
  );
}

