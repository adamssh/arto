import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategories';

const categorySchema = z.object({
  catName: z.string().min(1, 'Nama kategori wajib diisi').max(30, 'Maksimal 30 karakter'),
  catType: z.enum(['income', 'expense'], { required_error: 'Pilih tipe kategori' }),
  catColor: z.string().min(1, 'Warna wajib dipilih'),
  catIcon: z.string().min(1, 'Ikon wajib dipilih'),
});

const COLORS = [
  'primary', 'sage', 'expense', 
  'pastel-red', 'pastel-orange', 'pastel-green', 
  'pastel-teal', 'pastel-blue', 'pastel-lavender', 'pastel-purple', 
  'pastel-pink', 'pastel-peach'
];

const ICONS = [
  'ShoppingBag', 'Coffee', 'Utensils', 'Car', 'Bus', 'Plane', 'Home', 'Smartphone', 'Monitor', 'Gamepad2',
  'Heart', 'Briefcase', 'GraduationCap', 'Gift', 'Wallet', 'PiggyBank', 'Banknote', 'CreditCard', 'Shirt', 'Wrench'
];

export default function CategoryForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData?.id;
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const [initialColorName, initialIconName = 'ShoppingBag'] = (initialData?.color || 'pastel-red:ShoppingBag').split(':');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      catName: initialData?.name || '',
      catType: initialData?.type || 'expense',
      catColor: initialColorName,
      catIcon: initialIconName
    }
  });

  const selectedType = watch('catType');
  const selectedColor = watch('catColor');
  const selectedIcon = watch('catIcon');

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.catName,
        type: data.catType,
        color: `${data.catColor}:${data.catIcon}`
      };
      
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" autoComplete="off">
      <div className="flex bg-surface/50 p-1.5 rounded-xl2 border border-sage/20">
        <button
          type="button"
          onClick={() => setValue('catType', 'income')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            selectedType === 'income' ? 'bg-income text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          <LucideIcons.ArrowDownLeft size={16} />
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => setValue('catType', 'expense')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            selectedType === 'expense' ? 'bg-expense text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          <LucideIcons.ArrowUpRight size={16} />
          Pengeluaran
        </button>
      </div>

      <Input
        label="Nama Kategori"
        type="text"
        placeholder="Cth: Makanan, Gaji"
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        error={errors.catName?.message}
        {...register('catName')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Warna</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {COLORS.map((colorName) => (
            <button
              key={colorName}
              type="button"
              onClick={() => setValue('catColor', colorName)}
              className={`w-10 h-10 rounded-xl bg-${colorName} transition-transform ${
                selectedColor === colorName ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              aria-label={`Pilih warna ${colorName}`}
            />
          ))}
        </div>
        {errors.catColor && <span className="text-xs text-expense ml-1">{errors.catColor.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Ikon</label>
        <div className="flex flex-wrap gap-3 mt-1 max-h-40 overflow-y-auto p-1">
          {ICONS.map((iconName) => {
            const IconComponent = LucideIcons[iconName];
            return (
              <button
                key={iconName}
                type="button"
                onClick={() => setValue('catIcon', iconName)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  selectedIcon === iconName 
                    ? `bg-${selectedColor} text-surface/90 shadow-sm scale-110` 
                    : 'bg-surface border border-sage/20 text-text-secondary hover:border-primary/50'
                }`}
                aria-label={`Pilih ikon ${iconName}`}
              >
                <IconComponent size={20} strokeWidth={2.5} />
              </button>
            )
          })}
        </div>
        {errors.catIcon && <span className="text-xs text-expense ml-1">{errors.catIcon.message}</span>}
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

