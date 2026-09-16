import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategories';

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(30, 'Maksimal 30 karakter'),
  type: z.enum(['income', 'expense'], { required_error: 'Pilih tipe kategori' }),
  color: z.string().min(1, 'Warna wajib dipilih'),
});

const COLORS = [
  { name: 'primary', hex: 'bg-primary' },
  { name: 'sage', hex: 'bg-sage' },
  { name: 'beige', hex: 'bg-beige' },
  { name: 'expense', hex: 'bg-expense' },
  { name: 'cream', hex: 'bg-cream' },
  { name: 'primary-dark', hex: 'bg-primary-dark' }
];

export default function CategoryForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: '',
      type: 'expense',
      color: 'primary',
    }
  });

  const selectedType = watch('type');
  const selectedColor = watch('color');

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex bg-surface/50 p-1 rounded-xl2">
        <button
          type="button"
          onClick={() => setValue('type', 'expense')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            selectedType === 'expense' ? 'bg-surface shadow-soft text-expense' : 'text-text-secondary'
          }`}
        >
          Pengeluaran
        </button>
        <button
          type="button"
          onClick={() => setValue('type', 'income')}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            selectedType === 'income' ? 'bg-surface shadow-soft text-income' : 'text-text-secondary'
          }`}
        >
          Pemasukan
        </button>
      </div>

      <Input
        label="Nama Kategori"
        placeholder="Cth: Makanan, Gaji"
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Warna</label>
        <div className="flex gap-3 mt-1">
          {COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setValue('color', c.name)}
              className={`w-8 h-8 rounded-full ${c.hex} transition-transform ${
                selectedColor === c.name ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              aria-label={`Select color ${c.name}`}
            />
          ))}
        </div>
        {errors.color && <span className="text-xs text-expense ml-1">{errors.color.message}</span>}
      </div>

      <div className="flex gap-3 mt-4">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}

