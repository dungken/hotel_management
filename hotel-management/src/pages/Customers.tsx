import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../services/api';
import { mockCustomers } from '../services/mockData';
import { Customer } from '../types';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // In a real app, we would use the API
        // const response = await customerApi.getCustomers();
        // setCustomers(response.data.data);
        
        // For now, using mock data
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const searchString = searchTerm.toLowerCase();
    return (
      customer.ho.toLowerCase().includes(searchString) ||
      customer.ten.toLowerCase().includes(searchString) ||
      customer.email.toLowerCase().includes(searchString) ||
      customer.soDienThoai.includes(searchTerm)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const columns = [
    {
      header: 'Full Name',
      accessor: (customer: Customer) => `${customer.ho} ${customer.ten}`,
    },
    {
      header: 'Contact',
      accessor: (customer: Customer) => (
        <div>
          <div>{customer.email}</div>
          <div className="text-sm text-gray-500">{customer.soDienThoai}</div>
        </div>
      ),
    },
    {
      header: 'Nationality',
      accessor: 'quocTich' as keyof Customer,
    },
    {
      header: 'ID',
      accessor: (customer: Customer) => (
        <div>
          <div>{customer.loaiGiayTo}</div>
          <div className="text-sm text-gray-500">{customer.soGiayTo}</div>
        </div>
      ),
    },
    {
      header: 'Points',
      accessor: (customer: Customer) => (
        <Badge variant={customer.diemTichLuy > 100 ? 'success' : 'info'}>
          {customer.diemTichLuy} points
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (customer: Customer) => (
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customers/edit/${customer.maKhachHang}`);
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCustomer(customer);
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCreateCustomer = () => {
    navigate('/customers/create');
  };

  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      // In a real app, we would use the API
      // await customerApi.deleteCustomer(selectedCustomer.maKhachHang);
      
      // For now, just update the local state
      setCustomers(customers.filter(c => c.maKhachHang !== selectedCustomer.maKhachHang));
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <Button onClick={handleCreateCustomer}>Create Customer</Button>
      </div>

      <Card className="p-4">
        <div className="mb-4">
          <Input
            label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={filteredCustomers}
            keyExtractor={(customer) => customer.maKhachHang.toString()}
            onRowClick={handleRowClick}
          />
        )}
      </Card>

      {/* Customer Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Details"
      >
        {selectedCustomer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p className="text-lg font-medium text-gray-900">
                  {selectedCustomer.ho} {selectedCustomer.ten}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p className="text-gray-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                <p className="text-gray-900">{selectedCustomer.soDienThoai}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Nationality</h4>
                <p className="text-gray-900">{selectedCustomer.quocTich}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID Type</h4>
                <p className="text-gray-900">{selectedCustomer.loaiGiayTo}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">ID Number</h4>
                <p className="text-gray-900">{selectedCustomer.soGiayTo}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
                <p className="text-gray-900">{formatDate(selectedCustomer.ngaySinh)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Registration Date</h4>
                <p className="text-gray-900">{formatDate(selectedCustomer.ngayDangKy)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Points</h4>
                <Badge variant={selectedCustomer.diemTichLuy > 100 ? 'success' : 'info'}>
                  {selectedCustomer.diemTichLuy} points
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  navigate(`/customers/edit/${selectedCustomer.maKhachHang}`);
                }}
              >
                Edit Customer
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                Delete Customer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Customer"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete customer {selectedCustomer?.ho} {selectedCustomer?.ten}? This action cannot be undone.
          </p>
          <div className="flex space-x-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteCustomer}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Customers; 