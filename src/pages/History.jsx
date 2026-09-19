import TransactionList from '../components/transactions/TransactionList';

export default function History() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Riwayat</h1>
      </header>

      <TransactionList />
    </div>
  );
}
