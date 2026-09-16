import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { ChevronDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CategoryIcon from '../ui/CategoryIcon';
import DatePicker from '../ui/DatePicker';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../../hooks/useTransactions';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0'),
  category_id: z.string().min(1, 'Pilih kategori'),
  description: z.string().optional(),
  transaction_date: z.string().min(1, 'Tanggal wajib diisi'),
});

export default function TransactionForm({ initialData, onSuccess, onCancel, onOpenCategoryManage }) {
  const isEditing = !!initialData?.id;
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialData?.type || 'expense',
      amount: initialData?.amount || '',
      category_id: initialData?.category_id || '',
      description: initialData?.description || '',
      transaction_date: initialData?.transaction_date || format(new Date(), 'yyyy-MM-dd'),
    }
  });

  const selectedType = watch('type');
  
  const filteredCategories = categories.filter(c => c.type === selectedType);

  // Reset category when type changes and current category is invalid
  useEffect(() => {
    const currentCategoryId = watch('category_id');
    const isValidCategory = filteredCategories.some(c => c.id === currentCategoryId);
    
    if (currentCategoryId && !isValidCategory) {
      setValue('category_id', '', { shouldValidate: false });
    }
  }, [selectedType, filteredCategories, setValue, watch]);

  // Click outside to close custom select
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMutation.mutateAsync(initialData.id);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setIsDeleting(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || isDeleting;

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
      <div className="flex bg-surface/50 p-1.5 rounded-xl2 mb-1 border border-sage/20">
        <button
          type="button"
          onClick={() => setValue('type', 'income')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            selectedType === 'income' ? 'bg-income text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          <ArrowDownLeft size={16} />
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => setValue('type', 'expense')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            selectedType === 'expense' ? 'bg-expense text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          <ArrowUpRight size={16} />
          Pengeluaran
        </button>
      </div>

      <div className="flex flex-col">
        <Input
          label="Jumlah (Rp)"
          type="number"
          placeholder="0"
          error={errors.amount?.message}
          {...register('amount')}
        />
        <div className="flex gap-2 mt-2 ml-1">
          {[10000, 5000, 2000, 1000].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => {
                const current = Number(watch('amount')) || 0;
                setValue('amount', current + val, { shouldValidate: true });
              }}
              className="flex-1 py-1.5 text-xs font-medium bg-surface border border-sage/20 rounded-lg text-primary hover:bg-primary/5 hover:border-primary/30 transition-all"
            >
              +{val / 1000}k
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5" ref={dropdownRef}>
        <label className="text-sm font-medium text-text-primary ml-1">Kategori</label>
        {filteredCategories.length === 0 ? (
           <p className="text-sm text-expense mt-1">Belum ada kategori untuk tipe ini.</p>
        ) : (
          <div className="relative">
            <input type="hidden" {...register('category_id')} />
            <div 
              className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <div className="flex items-center gap-3">
                {watch('category_id') ? (() => {
                  const selectedCategory = filteredCategories.find(c => c.id === watch('category_id'));
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
                {filteredCategories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setValue('category_id', c.id, { shouldValidate: true });
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                      watch('category_id') === c.id ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                    }`}
                  >
                    <CategoryIcon colorString={c.color} size="sm" />
                    <span className="font-medium">{c.name}</span>
                  </button>
                ))}
                
                {onOpenCategoryManage && (
                  <div className="pt-1 mt-1 border-t border-sage/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(false);
                        onOpenCategoryManage();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sage/10 text-primary font-medium"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"/><path d="M12 5v14"/>
                        </svg>
                      </div>
                      <span>Tambah Kategori Baru</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {errors.category_id && <span className="text-xs text-expense ml-1">{errors.category_id.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5 relative">
        <input type="hidden" {...register('transaction_date')} />
        <DatePicker
          label="Tanggal"
          value={watch('transaction_date')}
          onChange={(val) => setValue('transaction_date', val, { shouldValidate: true })}
          error={errors.transaction_date?.message}
        />
      </div>

      <Input
        label="Catatan (opsional)"
        placeholder="Makan siang, bensin, dll"
        error={errors.description?.message}
        {...register('description')}
      />

      <div className="flex gap-3 mt-4 w-full">
        {isEditing ? (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleDelete} 
            disabled={isPending}
            className="flex-1 text-expense hover:bg-expense/10 hover:border-expense/30"
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </Button>
        ) : (
          onCancel ? (
            <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
              Batal
            </Button>
          ) : null
        )}
        
        <Button 
          type="submit" 
          disabled={isPending || filteredCategories.length === 0} 
          className="flex-1"
        >
          {isPending && !isDeleting ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}
