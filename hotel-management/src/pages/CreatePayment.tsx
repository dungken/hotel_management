import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { paymentApi } from '../services/api';
import { mockBookings } from '../services/mockData';
import { Payment } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface CreatePaymentForm {
  maDatPhong: number;
  maPhuongThuc: number;
  soTien: number;
  maGiaoDich: string;
  trangThai: string;
  soHoaDon?: string;
  xuatHoaDonVat: boolean;
  tenCongTy?: string;
  maSoThue?: string;
  ghiChu?: string;
}

const CreatePayment: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<CreatePaymentForm>({
    defaultValues: {
      xuatHoaDonVat: false
    }
  });

  const onSubmit = async (data: CreatePaymentForm) => {
    try {
      setLoading(true);
      // For now, use mock data instead of real API call
      // await paymentApi.createPayment(data);
      console.log('Payment created:', data);
      navigate('/payments');
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const isVatInvoice = watch('xuatHoaDonVat');

  // Mock payment methods
  const paymentMethods = [
    { value: 1, label: 'Cash' },
    { value: 2, label: 'Credit Card' },
    { value: 3, label: 'Bank Transfer' }
  ];

  // Mock booking options
  const bookingOptions = mockBookings.map(booking => ({
    value: booking.maDatPhong,
    label: `Booking ${booking.maDatPhong}`
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Payment</h1>
        
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Select
                label="Booking"
                options={bookingOptions}
                {...register('maDatPhong', { required: 'Booking is required' })}
                error={errors.maDatPhong?.message}
              />
            </div>

            <div>
              <Input
                label="Amount"
                type="number"
                {...register('soTien', { 
                  required: 'Amount is required',
                  min: { value: 0, message: 'Amount must be positive' }
                })}
                error={errors.soTien?.message}
              />
            </div>

            <div>
              <Select
                label="Payment Method"
                options={paymentMethods}
                {...register('maPhuongThuc', { required: 'Payment method is required' })}
                error={errors.maPhuongThuc?.message}
              />
            </div>

            <div>
              <Input
                label="Transaction ID"
                {...register('maGiaoDich', { required: 'Transaction ID is required' })}
                error={errors.maGiaoDich?.message}
              />
            </div>

            <div>
              <Input
                label="Invoice Number"
                {...register('soHoaDon')}
                error={errors.soHoaDon?.message}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="xuatHoaDonVat"
                {...register('xuatHoaDonVat')}
                className="mr-2"
              />
              <label htmlFor="xuatHoaDonVat">Issue VAT Invoice</label>
            </div>

            {isVatInvoice && (
              <>
                <div>
                  <Input
                    label="Company Name"
                    {...register('tenCongTy', { required: 'Company name is required for VAT invoice' })}
                    error={errors.tenCongTy?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Tax ID"
                    {...register('maSoThue', { required: 'Tax ID is required for VAT invoice' })}
                    error={errors.maSoThue?.message}
                  />
                </div>
              </>
            )}

            <div>
              <Input
                label="Notes"
                {...register('ghiChu')}
                error={errors.ghiChu?.message}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/payments')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Payment'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreatePayment; 