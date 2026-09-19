import { useState } from 'react';
import CategoryList from '../components/categories/CategoryList';
import PaymentMethodList from '../components/transactions/PaymentMethodList';

export default function Manage() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kelola</h1>
      </header>

      <div className="bg-surface/50 p-1.5 rounded-2xl flex gap-1 mb-6 border border-sage/10 shadow-soft">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'categories' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          Kategori
        </button>
        <button
          onClick={() => setActiveTab('payment_methods')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
            activeTab === 'payment_methods' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          Metode Pembayaran
        </button>
      </div>

      <div>
        {activeTab === 'categories' && <CategoryList />}
        {activeTab === 'payment_methods' && <PaymentMethodList />}
      </div>
    </div>
  );
}
