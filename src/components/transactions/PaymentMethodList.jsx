import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { usePaymentMethods, useDeletePaymentMethod } from '../../hooks/usePaymentMethods';
import PaymentMethodForm from './PaymentMethodForm';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function PaymentMethodList() {
  const { data: methods, isLoading } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  
  const [editingMethod, setEditingMethod] = useState(null);
  const [deletingMethod, setDeletingMethod] = useState(null);

  if (isLoading) return <div className="p-4 text-center text-text-secondary">Memuat metode pembayaran...</div>;

  const handleDelete = async () => {
    if (deletingMethod) {
      await deleteMutation.mutateAsync(deletingMethod.id);
      setDeletingMethod(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
        <Button 
          onClick={() => setEditingMethod({ isNew: true })}
          className="py-1.5 px-3 text-sm"
        >
          + Tambah
        </Button>
      </div>

      {(!methods || methods.length === 0) ? (
        <p className="text-sm text-text-secondary italic">Belum ada metode pembayaran</p>
      ) : (
        <div className="flex flex-col gap-2">
          {methods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-sage/10 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="font-medium text-text-primary">{method.name}</span>
              </div>
              <div className="flex items-center -mr-2">
                <button 
                  onClick={() => setEditingMethod(method)}
                  className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-primary transition-colors rounded-full"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => setDeletingMethod(method)}
                  className="w-11 h-11 flex items-center justify-center text-text-secondary hover:text-expense transition-colors rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal 
        isOpen={!!editingMethod} 
        onClose={() => setEditingMethod(null)}
        title={editingMethod?.id ? "Edit Metode" : "Tambah Metode"}
      >
        {editingMethod && (
          <PaymentMethodForm 
            initialData={editingMethod.isNew ? undefined : editingMethod} 
            onSuccess={() => setEditingMethod(null)}
            onCancel={() => setEditingMethod(null)}
          />
        )}
      </Modal>

      <Modal
        isOpen={!!deletingMethod}
        onClose={() => setDeletingMethod(null)}
        title="Hapus Metode Pembayaran"
      >
        <div className="flex flex-col gap-4">
          <p className="text-text-secondary">
            Apakah Anda yakin ingin menghapus metode <strong>{deletingMethod?.name}</strong>? 
            Transaksi yang menggunakan metode ini akan kehilangan referensinya.
          </p>
          <div className="flex gap-3 mt-2">
            <Button variant="secondary" onClick={() => setDeletingMethod(null)} className="flex-1">
              Batal
            </Button>
            <Button 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              className="flex-1 bg-expense hover:bg-expense/90"
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
