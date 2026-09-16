import { useEffect } from 'react';
import { X } from 'lucide-react';


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
    <div className="fixed inset-0 z-50 flex flex-col justify-end md:justify-center md:items-center bg-text-primary/40 backdrop-blur-sm p-0 md:p-4">
      <div 
        className="w-full bg-surface rounded-t-[32px] md:rounded-xl2 max-h-[90vh] overflow-y-auto p-5 md:p-6 shadow-[0_-8px_30px_rgba(85,117,97,0.12)] md:shadow-soft md:max-w-md mx-auto"
      >
        <div className="flex justify-between items-center mb-4 min-h-[44px]">
          {title ? <h2 className="text-xl font-semibold text-text-primary">{title}</h2> : <div />}
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary w-11 h-11 flex items-center justify-center -mr-2 rounded-full hover:bg-sage/10 transition-colors"
            aria-label="Tutup"
          >
            <X size={24} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

