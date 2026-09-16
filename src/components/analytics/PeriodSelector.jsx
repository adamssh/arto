import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function PeriodSelector({ currentDate, onChangeDate }) {
  const handlePrev = () => {
    onChangeDate(subMonths(currentDate, 1));
  };

  const handleNext = () => {
    onChangeDate(addMonths(currentDate, 1));
  };

  const label = format(currentDate, 'MMMM yyyy', { locale: idLocale });

  return (
    <div className="flex items-center justify-between mb-6 bg-surface/50 p-2 rounded-xl2 border border-sage/10">
      <button 
        onClick={handlePrev}
        className="p-2 text-text-secondary hover:text-primary transition-colors rounded-xl hover:bg-surface"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="font-semibold text-text-primary capitalize tracking-wide">{label}</span>
      <button 
        onClick={handleNext}
        className="p-2 text-text-secondary hover:text-primary transition-colors rounded-xl hover:bg-surface"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
