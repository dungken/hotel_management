import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { customerApi } from '../services/api';
import { Customer } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface CreateCustomerForm {
  ho: string;
  ten: string;
  email: string;
  soDienThoai: string;
  quocTich: string;
  loaiGiayTo: string;
  soGiayTo: string;
  ngaySinh: string;
}

const CreateCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CreateCustomerForm>();

  const onSubmit = async (data: CreateCustomerForm) => {
    setIsLoading(true);
    try {
      // In a real app, we would use the API
      // await customerApi.createCustomer(data);

      // For now, just navigate back
      navigate('/customers');
    } catch (error) {
      console.error('Error creating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const idTypes = [
    { value: 'CMND', label: 'CMND' },
    { value: 'CCCD', label: 'CCCD' },
    { value: 'Passport', label: 'Passport' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Customer</h1>
      </div>

      <Card className="max-w-3xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Input
                label="First Name"
                {...register('ho', { required: 'First name is required' })}
                error={errors.ho?.message}
              />
            </div>
            <div>
              <Input
                label="Last Name"
                {...register('ten', { required: 'Last name is required' })}
                error={errors.ten?.message}
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />
            </div>
            <div>
              <Input
                label="Phone Number"
                {...register('soDienThoai', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Invalid phone number',
                  },
                })}
                error={errors.soDienThoai?.message}
              />
            </div>
            <div>
              <Input
                label="Nationality"
                {...register('quocTich', { required: 'Nationality is required' })}
                error={errors.quocTich?.message}
              />
            </div>
            <div>
              <Select
                label="ID Type"
                {...register('loaiGiayTo', { required: 'ID type is required' })}
                error={errors.loaiGiayTo?.message}
                options={idTypes}
              />
            </div>
            <div>
              <Input
                label="ID Number"
                {...register('soGiayTo', { required: 'ID number is required' })}
                error={errors.soGiayTo?.message}
              />
            </div>
            <div>
              <Input
                label="Date of Birth"
                type="date"
                {...register('ngaySinh', { required: 'Date of birth is required' })}
                error={errors.ngaySinh?.message}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Customer'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/customers')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateCustomer; 