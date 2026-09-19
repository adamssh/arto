import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import Input from '../ui/Input';
import Button from '../ui/Button';
import CategoryIcon from '../ui/CategoryIcon';
import DatePicker from '../ui/DatePicker';
import { useCategories } from '../../hooks/useCategories';
import { usePaymentMethods } from '../../hooks/usePaymentMethods';
import { useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '../../hooks/useTransactions';

const transactionSchema = z.object({
  trxType: z.enum(['income', 'expense']),
  trxNominal: z.union([z.string(), z.number()]).transform(val => {
    if (typeof val === 'number') return val;
    const cleaned = val.replace(/[^0-9]/g, '');
    return Number(cleaned);
  }).pipe(z.number().positive('Jumlah harus lebih dari 0')),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  paymentMethodId: z.string().min(1, 'Metode pembayaran wajib dipilih'),
  trxDate: z.string().min(1, 'Tanggal wajib diisi'),
  trxNote: z.string().optional(),
});

export default function TransactionForm({ initialData, onSuccess, onCancel, onOpenCategoryManage, onOpenPaymentMethodManage }) {
  const isEditing = !!initialData?.id;
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const { data: paymentMethods = [] } = usePaymentMethods();
  const [isPMOpen, setIsPMOpen] = useState(false);
  const pmDropdownRef = useRef(null);
  const deleteMutation = useDeleteTransaction();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      trxType: initialData?.type || 'expense',
      trxNominal: initialData?.amount || '',
      categoryId: initialData?.category_id || '',
      paymentMethodId: initialData?.payment_method_id || '',
      trxDate: initialData?.transaction_date || format(new Date(), 'yyyy-MM-dd'),
      trxNote: initialData?.description || ''
    }
  });

  useEffect(() => {
    if (!isEditing && !getValues('paymentMethodId') && paymentMethods.length > 0) {
      const tunaiPM = paymentMethods.find(pm => pm.name.toLowerCase() === 'tunai');
      setValue('paymentMethodId', tunaiPM ? tunaiPM.id : paymentMethods[0].id, { shouldValidate: true });
    }
  }, [paymentMethods, isEditing, setValue, getValues]);  // Auto-select newly created Category
  const prevCategoryIds = useRef(new Set());
  useEffect(() => {
    if (categories.length === 0) return;
    const currentIds = categories.map(c => c.id);
    if (prevCategoryIds.current.size > 0) {
      const newIds = currentIds.filter(id => !prevCategoryIds.current.has(id));
      if (newIds.length > 0) {
        setValue('categoryId', newIds[0], { shouldValidate: true });
        const newCat = categories.find(c => c.id === newIds[0]);
        if (newCat && newCat.type !== getValues('trxType')) {
          setValue('trxType', newCat.type);
        }
      }
    }
    prevCategoryIds.current = new Set(currentIds);
  }, [categories, setValue, getValues]);

  // Auto-select newly created Payment Method
  const prevPaymentMethodIds = useRef(new Set());
  useEffect(() => {
    if (paymentMethods.length === 0) return;
    const currentIds = paymentMethods.map(p => p.id);
    if (prevPaymentMethodIds.current.size > 0) {
      const newIds = currentIds.filter(id => !prevPaymentMethodIds.current.has(id));
      if (newIds.length > 0) {
        setValue('paymentMethodId', newIds[0], { shouldValidate: true });
      }
    }
    prevPaymentMethodIds.current = new Set(currentIds);
  }, [paymentMethods, setValue]);  const selectedType = watch('trxType');
  const filteredCategories = categories.filter(c => c.type === selectedType);

  // Reset category when type changes and current category is invalid
  useEffect(() => {
    const currentCategoryId = watch('categoryId');
    const isValidCategory = filteredCategories.some(c => c.id === currentCategoryId);
    
    if (!isValidCategory && filteredCategories.length > 0) {
      // Auto select the first available category for convenience
      setValue('categoryId', filteredCategories[0].id, { shouldValidate: true });
    } else if (!isValidCategory && filteredCategories.length === 0) {
      setValue('categoryId', '', { shouldValidate: false });
    }
  }, [selectedType, filteredCategories, setValue, watch]);

  // Click outside to close custom select
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        
      if (pmDropdownRef.current && !pmDropdownRef.current.contains(event.target)) {
        setIsPMOpen(false);
      }
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        type: data.trxType,
        amount: data.trxNominal,
        category_id: data.categoryId,
        payment_method_id: data.paymentMethodId,
        transaction_date: data.trxDate,
        description: data.trxNote
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" autoComplete="off">
      <div className="flex bg-surface/50 p-1.5 rounded-xl2 mb-1 border border-sage/20">
        <button
          type="button"
          onClick={() => setValue('trxType', 'income')}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            selectedType === 'income' ? 'bg-income text-white shadow-md' : 'text-text-secondary hover:bg-surface/80 hover:text-text-primary'
          }`}
        >
          <ArrowDownLeft size={16} />
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => setValue('trxType', 'expense')}
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
          type="text"
          inputMode="decimal"
          placeholder="0"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          error={errors.trxNominal?.message}
          {...register('trxNominal')}
        />
        <div className="flex gap-2 mt-2 ml-1">
          {[10000, 5000, 2000, 1000].map(val => (
            <button
              key={val}
              type="button"
              onClick={() => {
                const current = Number(watch('trxNominal')) || 0;
                setValue('trxNominal', current + val, { shouldValidate: true });
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
            <input type="hidden" {...register('categoryId')} />
            <div 
              className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <div className="flex items-center gap-3">
                {watch('categoryId') ? (() => {
                  const selectedCategory = filteredCategories.find(c => c.id === watch('categoryId'));
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
                
                {onOpenCategoryManage && (
                  <div className="pt-1 mt-1 border-t border-sage/10">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryOpen(false);
                        onOpenCategoryManage(watch('trxType'));
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
        {errors.categoryId && <span className="text-xs text-expense ml-1">{errors.categoryId.message}</span>}
      </div>

      
      <div className="flex flex-col gap-1.5" ref={pmDropdownRef}>
        <label className="text-sm font-medium text-text-primary ml-1">Metode Pembayaran</label>
        <div className="relative">
          <input type="hidden" {...register('paymentMethodId')} />
          <div 
            className="w-full bg-surface/50 border border-sage/30 rounded-xl2 px-4 py-3 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all select-none"
            onClick={() => setIsPMOpen(!isPMOpen)}
          >
            <div className="flex items-center gap-3">
              {watch('paymentMethodId') ? (() => {
                const selectedPM = paymentMethods.find(p => p.id === watch('paymentMethodId'));
                return selectedPM ? (
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded flex-shrink-0 bg-${selectedPM.color || 'sage'}`}></div>
                    <span className="text-text-primary font-medium">{selectedPM.name}</span>
                  </div>
                ) : <span className="text-text-secondary">Pilih Metode</span>;
              })() : (
                <span className="text-text-secondary">Pilih Metode</span>
              )}
            </div>
            <ChevronDown size={18} className={`text-text-secondary transition-transform ${isPMOpen ? 'rotate-180' : ''}`} />
          </div>

          {isPMOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl2 shadow-[0_8px_30px_rgba(85,117,97,0.12)] border border-sage/10 overflow-hidden z-50 max-h-60 overflow-y-auto p-2 flex flex-col gap-1">
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setValue('paymentMethodId', pm.id, { shouldValidate: true });
                    setIsPMOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                    watch('paymentMethodId') === pm.id ? 'bg-primary/5 text-primary' : 'hover:bg-surface/80 text-text-primary'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex-shrink-0 bg-${pm.color || 'sage'}`}></div>
                  <span className="font-medium">{pm.name}</span>
                </button>
              ))}
              
              {onOpenPaymentMethodManage && (
                <div className="pt-1 mt-1 border-t border-sage/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPMOpen(false);
                      onOpenPaymentMethodManage();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-sage/10 text-primary font-medium"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"/><path d="M12 5v14"/>
                      </svg>
                    </div>
                    <span>Tambah Metode Pembayaran</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5 relative">
        <input type="hidden" {...register('trxDate')} />
        <DatePicker
          label="Tanggal"
          value={watch('trxDate')}
          onChange={(val) => setValue('trxDate', val, { shouldValidate: true })}
          error={errors.trxDate?.message}
        />
      </div>

      <Input
        label="Catatan (opsional)"
        placeholder="Makan siang, bensin, dll"
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        error={errors.trxNote?.message}
        {...register('trxNote')}
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
