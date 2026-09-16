
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { tailwindColors } from '../../utils/colors';

export default function ExpensePieChart({ data, selectedCategoryId, onSelectCategory }) {
  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-soft mt-4">
        <p className="text-sm font-medium text-text-primary mb-1">Belum ada pengeluaran</p>
        <p className="text-xs text-text-secondary">Tidak ada data untuk periode ini.</p>
      </div>
    );
  }

  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-surface rounded-xl2 px-6 py-5 border border-sage/10 shadow-soft mb-6">
      <div className="h-56 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="amount"
              stroke="none"
              onClick={(_, index) => {
                if (!onSelectCategory) return;
                const clickedId = data[index].id;
                onSelectCategory(selectedCategoryId === clickedId ? null : clickedId);
              }}
              cursor="pointer"
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.id} 
                  fill={entry.color} 
                  // If something is selected and it's not this one, dim it slightly
                  opacity={selectedCategoryId && selectedCategoryId !== entry.id ? 0.3 : 1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div 
            onClick={() => onSelectCategory && onSelectCategory(null)}
            className="flex flex-col items-center justify-center w-28 h-28 rounded-full pointer-events-auto cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Klik untuk melihat semua kategori"
          >
            <span className="text-xs text-text-secondary mb-0.5">Total</span>
            <span className="text-sm font-bold text-text-primary">{formatCurrency(totalExpense)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-0">
        {data.map(item => {
          const isSelected = selectedCategoryId === item.id;
          const isDimmed = selectedCategoryId && !isSelected;
          const percentage = Math.round((item.amount / totalExpense) * 100);

          return (
            <div 
              key={item.id} 
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : item.id)}
              className={`flex items-center justify-between transition-all cursor-pointer py-1.5 px-2 -mx-2 rounded-xl hover:bg-sage/5 ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-sm ${isSelected ? 'font-semibold text-text-primary' : 'font-medium text-text-secondary'}`}>
                  {item.categoryName}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-text-secondary w-8 text-right">{percentage}%</span>
                <span className={`text-sm ${isSelected ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

