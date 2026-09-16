import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TransactionItem from '../transactions/TransactionItem';

export default function RecentTransactions({ transactions, onEditTransaction }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Transaksi Terakhir</h3>
        <div className="bg-surface rounded-xl2 p-6 text-center border border-sage/10 shadow-soft">
          <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📝</span>
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">Belum ada transaksi bulan ini</p>
          <p className="text-xs text-text-secondary">Yuk tambah transaksi pertamamu lewat tombol di atas.</p>
        </div>
      </div>
    );
  }

  const recentTxs = transactions.slice(0, 5);

  return (
    <div className="pb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaksi Terakhir</h3>
        <Link to="/transactions" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Lihat semua
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="flex flex-col">
        {recentTxs.map(t => (
          <TransactionItem 
            key={t.id} 
            transaction={t} 
            onEdit={onEditTransaction}
          />
        ))}
      </div>
    </div>
  );
}

