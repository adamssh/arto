import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { format } from 'date-fns';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/useTransactions';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  category_id: z.string().min(1, 'Pilih kategori'),
  description: z.string().optional(),
  transaction_date: z.string().min(1, 'Tanggal wajib diisi'),
});

export default function TransactionForm({ initialData, onSuccess, onCancel, onOpenCategoryManage }) {
  const isEditing = !!initialData;
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData ? {
      ...initialData,
      transaction_date: initialData.transaction_date,
    } : {
      type: 'expense',
      amount: '',
      category_id: '',
      description: '',
      transaction_date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const selectedType = watch('type');
  
  const filteredCategories = categories.filter(c => c.type === selectedType);

  // Auto-select or reset category when type changes
  useEffect(() => {
    const currentCategoryId = watch('category_id');
    const isValidCategory = filteredCategories.some(c => c.id === currentCategoryId);
    
    if (filteredCategories.length > 0 && (!currentCategoryId || !isValidCategory)) {
      setValue('category_id', filteredCategories[0].id);
    } else if (filteredCategories.length === 0) {
      setValue('category_id', '');
    }
  }, [selectedType, filteredCategories, setValue, watch]);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (categories.length === 0 && !isLoadingCategories) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center gap-4">
        <p className="text-text-secondary">Tambahkan kategori terlebih dahulu</p>
        <Button onClick={onOpenCategoryManage}>Kelola Kategori</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex bg-surface/50 p-1 rounded-xl2 mb-2">
        <button
          type="button"
          onClick={() => setValue('type', 'expense')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            selectedType === 'expense' ? 'bg-surface shadow-sm text-expense' : 'text-text-secondary'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setValue('type', 'income')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            selectedType === 'income' ? 'bg-surface shadow-sm text-income' : 'text-text-secondary'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <Input
        label="Jumlah (Rp)"
        type="number"
        placeholder="0"
        error={errors.amount?.message}
        {...register('amount')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Kategori</label>
        {filteredCategories.length === 0 ? (
           <p className="text-sm text-expense mt-1">Belum ada kategori untuk tipe ini.</p>
        ) : (
          <select 
            className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            {...register('category_id')}
          >
            <option value="" disabled>Pilih Kategori</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        {errors.category_id && <span className="text-xs text-expense ml-1">{errors.category_id.message}</span>}
      </div>

      <Input
        label="Tanggal"
        type="date"
        error={errors.transaction_date?.message}
        {...register('transaction_date')}
      />

      <Input
        label="Catatan (opsional)"
        placeholder="Makan siang, bensin, dll"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex gap-3 mt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isPending || filteredCategories.length === 0} 
          className="flex-1"
        >
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
