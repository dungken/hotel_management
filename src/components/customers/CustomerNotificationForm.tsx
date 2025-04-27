'use client';

import React, { useState } from 'react';
import { customersService } from '@/services/customers.service';

interface CustomerNotificationFormProps {
  customerId: number;
  onSubmit?: () => void;
}

const NOTIFICATION_TYPES = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'SMS', label: 'SMS' }
];

const NOTIFICATION_PURPOSES = [
  { value: 'BOOKING_CONFIRMATION', label: 'Booking Confirmation' },
  { value: 'PROMOTION', label: 'Promotion' },
  { value: 'REMINDER', label: 'Reminder' },
  { value: 'FEEDBACK_REQUEST', label: 'Feedback Request' }
];

export const CustomerNotificationForm: React.FC<CustomerNotificationFormProps> = ({
  customerId,
  onSubmit
}) => {
  const [type, setType] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [purpose, setPurpose] = useState<'BOOKING_CONFIRMATION' | 'PROMOTION' | 'REMINDER' | 'FEEDBACK_REQUEST'>('BOOKING_CONFIRMATION');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await customersService.sendNotification({
        customerId,
        type,
        purpose,
        subject,
        content,
        scheduledDate: scheduledDate || undefined
      });
      setSuccess(true);
      // Reset form
      setSubject('');
      setContent('');
      setScheduledDate('');
      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      setError('Failed to send notification. Please try again.');
      console.error('Error sending notification:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 text-green-800 rounded-lg">
        <p>Notification sent successfully!</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
        >
          Send another notification
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'EMAIL' | 'SMS')}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {NOTIFICATION_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purpose
          </label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as any)}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {NOTIFICATION_PURPOSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter notification subject"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter notification content"
        />
      </div>

      <div>
        <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
          Schedule For (Optional)
        </label>
        <input
          type="datetime-local"
          id="scheduledDate"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg text-white ${
          loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Sending...' : 'Send Notification'}
      </button>
    </form>
  );
};
