import React from 'react';
import { useNavigate } from 'react-router-dom';
import { mockPayments } from '../services/mockData';
import { Payment, Column } from '../types';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const payments = mockPayments;

  const columns: Column<Payment>[] = [
    { header: 'ID', accessor: 'maThanhToan' as keyof Payment },
    { header: 'Booking ID', accessor: 'maDatPhong' as keyof Payment },
    { header: 'Amount', accessor: 'soTien' as keyof Payment },
    { header: 'Status', accessor: (payment: Payment) => (
      <Badge variant={payment.trangThai === 'COMPLETED' ? 'success' : 'warning'}>
        {payment.trangThai}
      </Badge>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Payments</h1>
        <Button onClick={() => navigate('/payments/create')}>Create Payment</Button>
      </div>
      <Table
        columns={columns}
        data={payments}
        keyExtractor={(payment) => payment.maThanhToan.toString()}
      />
    </div>
  );
};

export default Payments; 