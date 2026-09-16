import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { tailwindColors } from '../../utils/colors';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);

    return (
      <div className="bg-surface/95 backdrop-blur border border-sage/20 p-3 rounded-xl shadow-lg">
        <p className="font-semibold text-text-primary mb-2 text-sm">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs">
            <span style={{ color: entry.color }} className="font-medium">
              {entry.name === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </span>
            <span className="font-semibold text-text-primary">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TrendChart({ data }) {
  const formatYAxis = (tickItem) => {
    if (tickItem === 0) return '0';
    return `${tickItem / 1000}k`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 text-text-primary">Tren 6 Bulan Terakhir</h3>
      <div className="bg-surface rounded-xl2 p-4 pt-6 border border-sage/10 shadow-soft h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={tailwindColors['sage']} strokeOpacity={0.2} />
            <XAxis 
              dataKey="monthLabel" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: tailwindColors['text-secondary'] }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: tailwindColors['text-secondary'] }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: tailwindColors['sage'], opacity: 0.1 }} />
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs font-medium text-text-secondary ml-1">{value === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>}
            />
            <Bar dataKey="income" name="income" fill={tailwindColors['income']} radius={[4, 4, 0, 0]} maxBarSize={40} />
            <Bar dataKey="expense" name="expense" fill={tailwindColors['beige']} radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

