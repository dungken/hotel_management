export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const parseCurrency = (formattedValue: string): number => {
  return Number(formattedValue.replace(/[^0-9.-]+/g, ''));
};
