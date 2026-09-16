import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import { useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';

const budgetSchema = z.object({
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  category_id: z.string().min(1, 'Pilih kategori'),
});

export default function BudgetForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData?.id;
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const [submitError, setSubmitError] = useState(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: initialData?.amount || '',
      category_id: initialData?.category_id || '',
    }
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          ...data,
          month: currentMonth,
          year: currentYear
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          month: currentMonth,
          year: currentYear
        });
      }
      onSuccess?.();
    } catch (error) {
      setSubmitError(error.message || 'Gagal menyimpan budget');
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {submitError && (
        <div className="bg-expense/10 text-expense p-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Kategori Pengeluaran</label>
        {expenseCategories.length === 0 ? (
          <p className="text-sm text-expense mt-1">Belum ada kategori pengeluaran.</p>
        ) : (
          <select 
            className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
            {...register('category_id')}
          >
            <option value="" disabled>Pilih Kategori</option>
            {expenseCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
        {errors.category_id && <span className="text-xs text-expense ml-1">{errors.category_id.message}</span>}
      </div>

      <Input
        label="Batas Maksimal (Rp)"
        type="number"
        placeholder="0"
        error={errors.amount?.message}
        {...register('amount')}
      />

      <div className="flex gap-3 mt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isPending || expenseCategories.length === 0} 
          className="flex-1"
        >
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}

