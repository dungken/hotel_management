import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { customerApi } from '../services/api';
import { mockCustomers } from '../services/mockData';
import { Customer } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

interface EditCustomerForm {
  ho: string;
  ten: string;
  email: string;
  soDienThoai: string;
  quocTich: string;
  loaiGiayTo: string;
  soGiayTo: string;
  ngaySinh: string;
}

const EditCustomer: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditCustomerForm>();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        // In a real app, we would use the API
        // const response = await customerApi.getCustomer(parseInt(id!));
        // const customer = response.data.data;

        // For now, using mock data
        const customer = mockCustomers.find(c => c.maKhachHang === parseInt(id!));

        if (customer) {
          reset({
            ho: customer.ho,
            ten: customer.ten,
            email: customer.email,
            soDienThoai: customer.soDienThoai,
            quocTich: customer.quocTich,
            loaiGiayTo: customer.loaiGiayTo,
            soGiayTo: customer.soGiayTo,
            ngaySinh: customer.ngaySinh.split('T')[0], // Format date for input
          });
        } else {
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        navigate('/customers');
      } finally {
        setIsFetching(false);
      }
    };

    if (id) {
      fetchCustomer();
    } else {
      navigate('/customers');
    }
  }, [id, navigate, reset]);

  const onSubmit = async (data: EditCustomerForm) => {
    setIsLoading(true);
    try {
      // In a real app, we would use the API
      // await customerApi.updateCustomer(parseInt(id!), data);

      // For now, just navigate back
      navigate('/customers');
    } catch (error) {
      console.error('Error updating customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const idTypes = [
    { value: 'CMND', label: 'CMND' },
    { value: 'CCCD', label: 'CCCD' },
    { value: 'Passport', label: 'Passport' },
  ];

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
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
              {isLoading ? 'Saving...' : 'Save Changes'}
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

export default EditCustomer; 