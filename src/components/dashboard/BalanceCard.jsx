import Card from '../ui/Card';

export default function BalanceCard({ balance }) {
  const formattedBalance = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(balance);

  return (
    <Card className="mb-6 bg-primary text-surface border-none shadow-soft overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-8 -mb-8" />
      
      <div className="relative z-10">
        <p className="text-surface/80 text-sm font-medium mb-1">Total Saldo</p>
        <h2 className="text-3xl font-bold tracking-tight">{formattedBalance}</h2>
      </div>
    </Card>
  );
}
