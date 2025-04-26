import api from './api';
import { Payment, CreatePaymentRequest } from '../types/payment.types';

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get<{ messenge: string, data: any[] }>('/ThanhToan/LayThanhToan');

  // Map API response to our frontend model
  return response.data.data.map(item => ({
    id: item.maThanhToan,
    booking: {
      id: item.maDatPhong,
      customer: { id: 0, name: '', email: '', phone: '' },
      room: { id: 0, number: '', status: 'occupied', floor: 0, type: { id: 0, name: '', price: 0, description: '', capacity: 0 } },
      checkInDate: '',
      checkOutDate: '',
      status: 'confirmed',
      channel: { id: 0, name: '' },
      totalPrice: 0
    },
    amount: item.soTien,
    date: item.ngayThanhToan,
    method: mapMethod(item.maPhuongThuc),
    status: item.trangThai.toLowerCase(),
    invoiceNumber: item.soHoaDon
  }));
};

export const createPayment = async (data: CreatePaymentRequest): Promise<Payment> => {
  // Transform to match API structure
  const apiData = {
    maDatPhong: data.bookingId,
    maPhuongThuc: mapMethodToId(data.method),
    soTien: data.amount,
    maGiaoDich: generateTransactionId(),
    trangThai: "COMPLETED",
    tenCongTy: "",
    maSoThue: "",
    ghiChu: ""
  };

  const response = await api.put<{ messenge: string, data: any }>('/ThanhToan/TaoThanhToan', apiData);

  // Map API response to our frontend model
  return {
    id: response.data.data.maThanhToan,
    booking: {
      id: response.data.data.maDatPhong,
      customer: { id: 0, name: '', email: '', phone: '' },
      room: { id: 0, number: '', status: 'occupied', floor: 0, type: { id: 0, name: '', price: 0, description: '', capacity: 0 } },
      checkInDate: '',
      checkOutDate: '',
      status: 'confirmed',
      channel: { id: 0, name: '' },
      totalPrice: 0
    },
    amount: response.data.data.soTien,
    date: response.data.data.ngayThanhToan,
    method: mapMethod(response.data.data.maPhuongThuc),
    status: response.data.data.trangThai.toLowerCase(),
    invoiceNumber: response.data.data.soHoaDon
  };
};

export const generateInvoice = async (paymentId: number): Promise<Blob> => {
  try {
    // API không có endpoint riêng để tạo file PDF hóa đơn
    // Trong môi trường thực tế, bạn sẽ cần thêm endpoint này vào API

    // Cập nhật thông tin VAT cho thanh toán
    const response = await api.put<{ messenge: string, data: any }>('/ThanhToan/XuatHoaDonVAT', null, {
      params: {
        maThanhToan: paymentId,
        maSoThue: '123456789',
        tenCongTy: 'Example Company',
        ghiChu: 'VAT Invoice'
      }
    });

    // Thông thường API sẽ trả về file PDF, nhưng ở đây chúng ta tạo một blob giả lập
    // Tạo một đối tượng Blob giả lập làm ví dụ
    const invoiceContent = `
      INVOICE #${response.data.data.soHoaDon || 'INV' + paymentId}
      ===============================
      Date: ${new Date().toLocaleDateString()}
      Amount: $${response.data.data.soTien}
      Payment Method: ${mapMethod(response.data.data.maPhuongThuc)}
      VAT: ${response.data.data.xuatHoaDonVat ? 'Yes' : 'No'}
      Company: ${response.data.data.tenCongTy || 'N/A'}
      Tax ID: ${response.data.data.maSoThue || 'N/A'}
      ===============================
      Thank you for your business!
    `;

    return new Blob([invoiceContent], { type: 'text/plain' });
  } catch (error) {
    console.error('Error generating invoice:', error);
    // Nếu không thể tạo hóa đơn từ API, tạo một Blob trống
    return new Blob(['Error generating invoice'], { type: 'text/plain' });
  }
};

// Helper functions
const mapMethod = (methodId: number): 'cash' | 'credit_card' | 'bank_transfer' => {
  switch (methodId) {
    case 1: return 'cash';
    case 2: return 'credit_card';
    default: return 'bank_transfer';
  }
};

const mapMethodToId = (method: string): number => {
  switch (method) {
    case 'cash': return 1;
    case 'credit_card': return 2;
    case 'bank_transfer': return 3;
    default: return 1;
  }
};

const generateTransactionId = (): string => {
  return `TXN${Math.floor(Math.random() * 1000000)}`;
};
