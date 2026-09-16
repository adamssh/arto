import { useState, useRef, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function DatePicker({ value, onChange, label, error, align = 'left', compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef(null);

  // Parse current selected date
  const selectedDate = value ? parseISO(value) : new Date();

  useEffect(() => {
    if (value) {
      setInputValue(format(parseISO(value), 'dd/MM/yyyy'));
    } else {
      setInputValue('');
    }
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day) => {
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '');
    
    if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
    if (raw.length > 5) raw = raw.slice(0, 5) + '/' + raw.slice(5);
    raw = raw.slice(0, 10);
    
    setInputValue(raw);

    if (raw.length === 10) {
      const parts = raw.split('/');
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      
      const parsed = new Date(year, month, day);
      if (
        parsed.getFullYear() === year &&
        parsed.getMonth() === month &&
        parsed.getDate() === day
      ) {
        onChange(format(parsed, 'yyyy-MM-dd'));
        setCurrentMonth(parsed);
      }
    } else if (raw === '') {
      onChange('');
    }
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const isSelected = isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);
      const isToday = isSameDay(day, new Date());

      days.push(
        <button
          key={day.toString()}
          type="button"
          onClick={() => onDateClick(cloneDay)}
          className={`
            w-8 h-8 md:w-8 md:h-8 mx-auto flex items-center justify-center rounded-full text-sm transition-all
            ${!isCurrentMonth ? 'text-text-secondary/40' : 'text-text-primary'}
            ${isSelected ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' : 'hover:bg-primary/10'}
            ${isToday && !isSelected ? 'border border-primary text-primary font-semibold' : ''}
          `}
        >
          {formattedDate}
        </button>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7 gap-1 mb-1" key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const alignClass = align === 'right' ? 'right-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0';

  return (
    <div className="flex flex-col gap-1.5 relative" ref={dropdownRef}>
      {label && <label className="text-sm font-medium text-text-primary ml-1">{label}</label>}
      
      <div 
        className={`w-full bg-surface/50 border flex items-center transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-sage/30 hover:border-primary/50'}
          ${compact ? 'pl-1.5 pr-2 py-1.5 rounded-xl' : 'pl-2 pr-4 py-2.5 rounded-xl2'}
        `}
      >
        <div className={`flex items-center w-full ${compact ? 'gap-1' : 'gap-1.5'}`}>
          <button 
             type="button"
             onClick={() => setIsOpen(!isOpen)}
             className={`shrink-0 flex items-center justify-center rounded-lg hover:bg-sage/10 text-text-secondary focus:outline-none transition-colors ${compact ? 'p-1' : 'p-1.5'}`}
          >
             <CalendarIcon size={16} className={value ? 'text-primary' : 'text-text-secondary'} />
          </button>
          <input 
            type="text"
            inputMode="numeric"
            placeholder="dd/mm/yyyy"
            value={inputValue}
            onChange={handleInputChange}
            autoComplete="off"
            data-lpignore="true"
            data-1p-ignore="true"
            className="w-full bg-transparent font-medium text-text-primary placeholder:text-text-secondary placeholder:font-normal focus:outline-none"
          />
        </div>
      </div>

      {isOpen && (
        <div className={`absolute bottom-full ${alignClass} w-[280px] sm:w-[320px] mb-2 bg-surface rounded-xl2 shadow-[0_-8px_30px_rgba(85,117,97,0.15)] border border-sage/10 p-3 z-50 origin-bottom animate-in fade-in zoom-in-95`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-full hover:bg-sage/10 text-text-secondary hover:text-primary transition-colors">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-semibold text-text-primary text-sm">
              {format(currentMonth, 'MMMM yyyy', { locale: idLocale })}
            </h2>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-full hover:bg-sage/10 text-text-secondary hover:text-primary transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-semibold text-text-secondary uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="flex flex-col">
            {rows}
          </div>
          
          <div className="mt-2 pt-2 border-t border-sage/10 text-center">
            <button 
              type="button" 
              onClick={() => {
                onChange(format(new Date(), 'yyyy-MM-dd'));
                setIsOpen(false);
              }}
              className="text-sm font-medium text-primary hover:underline"
            >
              Kembali ke Hari Ini
            </button>
          </div>
        </div>
      )}
      
      {error && <span className="text-xs text-expense ml-1">{error}</span>}
    </div>
  );
}

