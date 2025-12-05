'use client';

import { useState } from "react";
import { submitBooking } from "@/lib/firestore";
import { Button, Input, Select, DatePicker, Modal, message, Form } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  people: number;
  date: Date | null;
}

export default function BookingForm() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  const isWednesdayOrFriday = (date: dayjs.Dayjs) => {
    const day = date.day();
    return day === 3 || day === 5; // 3 = Wednesday, 5 = Friday
  };

  const handleSubmit = async (values: BookingFormData) => {
    if (!values.date) {
      message.error('Please select a date');
      return;
    }

    if (!isWednesdayOrFriday(dayjs(values.date))) {
      message.error('Please select a Wednesday or Friday');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitBooking({
        name: values.name,
        email: values.email,
        phone: values.phone,
        people: values.people,
        date: values.date
      });
      
      message.success('Booking submitted successfully! We will review and get back to you soon.');
      form.resetFields();
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        size="large" 
        icon={<CalendarOutlined />}
        onClick={() => setIsModalVisible(true)}
        style={{
          backgroundColor: '#1976d2',
          borderColor: '#1976d2',
          color: '#ffffff'
        }}
        className="hover:!bg-[#1976d2] hover:!border-[#1976d2]"
      >
        Book Coworking Space
      </Button>

      <Modal
        title="Book Your Coworking Space"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter your email address" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>

          <Form.Item
            label="Number of People"
            name="people"
            rules={[{ required: true, message: 'Please select number of people' }]}
          >
            <Select placeholder="Select number of people">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <Option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Preferred Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select date (Wednesdays & Fridays only)"
              disabledDate={(current) => {
                if (!current) return false;
                const day = current.day();
                return day !== 3 && day !== 5; // Disable all days except Wed(3) and Fri(5)
              }}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <div className="text-sm text-gray-600 mb-4">
            <p><strong>Note:</strong> Bookings are only available on Wednesdays and Fridays.</p>
            <p><strong>Location:</strong> Tecgrw Ltd Office, KG 317, Kibagabaga, Kigali</p>
          </div>

          <Form.Item className="mb-0">
            <div className="flex gap-2 justify-end">
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
                style={{
                  backgroundColor: '#1976d2',
                  borderColor: '#1976d2',
                  color: '#ffffff'
                }}
                className="hover:!bg-blue-700 hover:!border-blue-700"
              >
                Submit Booking Request
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
