'use client';

import { useEffect, useState } from "react";
import { getBookings, acceptBooking, rejectBooking, deleteBooking } from "@/lib/firestore";
import { onUserChanged, logout } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { useRouter } from "next/navigation";
import { Table, Button, Tag, Space, Statistic, Card, Row, Col, Spin, message } from 'antd';
import { CheckOutlined, CloseOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface BookingData {
  id: string;
  name: string;
  email: string;
  phone: string;
  people: number;
  date?: any;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: any;
  processedAt?: any;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onUserChanged((user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      loadBookings();
    });

    return () => unsubscribe();
  }, [router]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const bookingsData = await getBookings();
      // Ensure all required fields are present
      const normalizedBookings: BookingData[] = bookingsData.map((b: any) => ({
        id: b.id,
        name: b.name ?? '',
        email: b.email ?? '',
        phone: b.phone ?? '',
        people: b.people ?? 0,
        date: b.date,
        status: b.status ?? 'pending',
        createdAt: b.createdAt,
        processedAt: b.processedAt,
      }));
      setBookings(normalizedBookings);
    } catch (error) {
      console.error("Error loading bookings:", error);
      message.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await acceptBooking(id);
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: "accepted" as const, processedAt: new Date() } : b);
      setBookings(updatedBookings);
      
      // Send confirmation email to customer
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await sendEmail('booking_acceptance', booking);
          console.log('Confirmation email sent successfully');
        } catch (err) {
          console.log('Email failed:', err);
        }
      }
      
      message.success('Booking accepted and customer notified!');
    } catch (error) {
      console.error("Error accepting booking:", error);
      message.error('Failed to accept booking');
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleReject = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await rejectBooking(id);
      const updatedBookings = bookings.map(b => b.id === id ? { ...b, status: "rejected" as const, processedAt: new Date() } : b);
      setBookings(updatedBookings);
      
      // Send rejection email to customer
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        try {
          await sendEmail('booking_rejection', booking);
          console.log('Rejection email sent successfully');
        } catch (err) {
          console.log('Email failed:', err);
        }
      }
      
      message.success('Booking rejected and customer notified!');
    } catch (error) {
      console.error("Error rejecting booking:", error);
      message.error('Failed to reject booking');
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleDelete = async (id: string) => {
    setProcessingIds(prev => [...prev, id]);
    try {
      await deleteBooking(id);
      const updatedBookings = bookings.filter(b => b.id !== id);
      setBookings(updatedBookings);
      message.success('Booking deleted successfully!');
    } catch (error) {
      console.error("Error deleting booking:", error);
      message.error('Failed to delete booking');
    } finally {
      setProcessingIds(prev => prev.filter(pId => pId !== id));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      message.error('Failed to logout');
    }
  };

  const columns: ColumnsType<BookingData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'People',
      dataIndex: 'people',
      key: 'people',
      width: 80,
      align: 'center',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => date ? new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString() : '-',
      sorter: (a, b) => {
        const dateA = new Date(a.date?.seconds ? a.date.seconds * 1000 : a.date || 0);
        const dateB = new Date(b.date?.seconds ? b.date.seconds * 1000 : b.date || 0);
        return dateA.getTime() - dateB.getTime();
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let text = status;
        if (status === 'pending') {
          color = 'orange';
          text = 'Pending';
        } else if (status === 'accepted') {
          color = 'green';
          text = 'Accepted';
        } else if (status === 'rejected') {
          color = 'red';
          text = 'Rejected';
        }
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const isProcessing = processingIds.includes(record.id);
        if (record.status === 'pending') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                loading={isProcessing}
                onClick={() => handleAccept(record.id)}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              >
                Accept
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                loading={isProcessing}
                onClick={() => handleReject(record.id)}
              >
                Reject
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                size="small"
                loading={isProcessing}
                onClick={() => handleDelete(record.id)}
                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: '#fff' }}
                title="Delete booking permanently"
              >
                Delete
              </Button>
            </Space>
          );
        }
        return (
          <Space>
            <span style={{ color: '#999' }}>Processed</span>
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={isProcessing}
              onClick={() => handleDelete(record.id)}
              style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: '#fff' }}
              title="Delete booking permanently"
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Management</h1>
        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>

      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic title="Total Bookings" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Accepted" value={stats.accepted} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Rejected" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
        className="bg-white rounded-lg shadow"
      />
    </div>
  );
}