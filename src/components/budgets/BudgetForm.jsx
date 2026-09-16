import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown } from 'lucide-react';
import CategoryIcon from '../ui/CategoryIcon';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCategories } from '../../hooks/useCategories';
import { useCreateBudget, useUpdateBudget } from '../../hooks/useBudgets';

const budgetSchema = z.object({
  budgetNominal: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  categoryId: z.string().min(1, 'Pilih kategori'),
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

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budgetNominal: initialData?.amount || '',
      categoryId: initialData?.category_id || '',
    }
  });

  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      const payload = {
        amount: data.budgetNominal,
        category_id: data.categoryId,
        month: currentMonth,
        year: currentYear
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ 
          id: initialData.id, 
          ...payload
        });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onSuccess?.();
    } catch (error) {
      setSubmitError(error.message || 'Gagal menyimpan budget');
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" autoComplete="off">
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
          <div className="relative" ref={categoryDropdownRef}>
            <input type="hidden" {...register('categoryId')} />
            <div 
              className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <div className="flex items-center gap-3">
                {watch('categoryId') ? (() => {
                  const selectedCategory = expenseCategories.find(c => c.id === watch('categoryId'));
                  if (selectedCategory) {
                    return (
                      <>
                        <CategoryIcon colorString={selectedCategory.color} size="sm" />
                        <span className="text-text-primary font-medium">{selectedCategory.name}</span>
                      </>
                    );
                  }
                  return <span className="text-text-secondary">Pilih Kategori</span>;
                })() : (
                  <span className="text-text-secondary">Pilih Kategori</span>
                )}
              </div>
              <ChevronDown size={18} className={`text-text-secondary transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </div>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl2 shadow-[0_8px_30px_rgba(85,117,97,0.12)] border border-sage/10 overflow-hidden z-50 max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
                {expenseCategories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setValue('categoryId', c.id, { shouldValidate: true });
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      watch('categoryId') === c.id ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                    }`}
                  >
                    <CategoryIcon colorString={c.color} size="sm" />
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {errors.categoryId && <span className="text-xs text-expense ml-1">{errors.categoryId.message}</span>}
      </div>

      <Input
        label="Batas Maksimal (Rp)"
        type="text"
        inputMode="decimal"
        placeholder="0"
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        error={errors.budgetNominal?.message}
        {...register('budgetNominal')}
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

