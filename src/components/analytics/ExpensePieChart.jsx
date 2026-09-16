import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { tailwindColors } from '../../utils/colors';

// Custom render for active (highlighted) slice
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8} // Enlarge the selected slice
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export default function ExpensePieChart({ data, selectedCategoryId }) {
  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);

  // Approach: Highlight selected slice by enlarging it using Recharts 'activeIndex' and 'renderActiveShape'.
  // This keeps all data visible but draws the user's attention to the selected category.
  const activeIndex = useMemo(() => {
    if (!selectedCategoryId) return -1;
    return data.findIndex(item => item.id === selectedCategoryId);
  }, [data, selectedCategoryId]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-sm mt-4">
        <p className="text-sm font-medium text-text-primary mb-1">Belum ada pengeluaran</p>
        <p className="text-xs text-text-secondary">Tidak ada data untuk periode ini.</p>
      </div>
    );
  }

  const totalExpense = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-surface rounded-xl2 p-6 border border-sage/10 shadow-sm">
      <div className="h-64 relative">
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
              activeIndex={activeIndex === -1 ? undefined : activeIndex}
              activeShape={renderActiveShape}
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
          <span className="text-xs text-text-secondary">Total</span>
          <span className="text-sm font-bold text-text-primary">{formatCurrency(totalExpense)}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {data.map(item => {
          const isSelected = selectedCategoryId === item.id;
          const isDimmed = selectedCategoryId && !isSelected;
          const percentage = Math.round((item.amount / totalExpense) * 100);

          return (
            <div 
              key={item.id} 
              className={`flex items-center justify-between transition-opacity ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
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

