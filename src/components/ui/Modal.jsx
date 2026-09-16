import { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-primary/20 backdrop-blur-sm">
      <Card className="w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-text-primary"
        >
          <X size={20} />
        </button>
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </Card>
    </div>
  );
}
