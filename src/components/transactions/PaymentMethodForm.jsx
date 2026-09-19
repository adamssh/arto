import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useCreatePaymentMethod, useUpdatePaymentMethod } from '../../hooks/usePaymentMethods';


const COLORS = [
  'primary', 'sage', 'expense', 
  'pastel-red', 'pastel-orange', 'pastel-green', 
  'pastel-teal', 'pastel-blue', 'pastel-lavender', 'pastel-purple', 
  'pastel-pink', 'pastel-peach'
];

const pmSchema = z.object({
  name: z.string().min(1, 'Nama metode wajib diisi').max(30, 'Maksimal 30 karakter'),
  color: z.string().min(1, 'Warna wajib dipilih'),
});


export default function PaymentMethodForm({ initialData, onSuccess, onCancel }) {
  const isEditing = !!initialData?.id;
  const createMutation = useCreatePaymentMethod();
  const updateMutation = useUpdatePaymentMethod();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(pmSchema),

    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || 'sage',
    }

  });

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save payment method:', error);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const selectedColor = watch('color');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" autoComplete="off">
      <Input
        label="Nama Metode Pembayaran"
        type="text"
        placeholder="Cth: Tunai, BCA, OVO"
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
        error={errors.name?.message}
        {...register('name')}
      />

      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary ml-1">Warna Label</label>
        <div className="flex flex-wrap gap-3 mt-1">
          {COLORS.map((colorName) => (
            <button
              key={colorName}
              type="button"
              onClick={() => setValue('color', colorName)}
              className={`w-10 h-10 rounded-xl bg-${colorName} transition-transform ${
                selectedColor === colorName ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''
              }`}
              aria-label={`Pilih warna ${colorName}`}
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
