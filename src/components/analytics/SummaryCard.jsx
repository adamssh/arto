export default function SummaryCard({ income, expense }) {
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);

  const balance = income - expense;

  return (
    <div className="bg-primary-dark text-surface rounded-xl2 p-6 shadow-soft mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -ml-8 -mb-8" />
      
      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-surface/80 text-xs font-medium uppercase tracking-wider mb-1">Total Pemasukan</p>
            <p className="text-xl font-semibold">{formatCurrency(income)}</p>
          </div>
          <div className="text-right">
            <p className="text-surface/80 text-xs font-medium uppercase tracking-wider mb-1">Total Pengeluaran</p>
            <p className="text-xl font-semibold">{formatCurrency(expense)}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-surface/80 text-xs font-medium uppercase tracking-wider mb-1">Sisa Saldo</p>
          <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>
    </div>
  );
}
