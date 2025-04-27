'use client';

import React, { useState } from 'react';
import { customersService } from '@/services/customers.service';

interface CustomerFeedbackFormProps {
  customerId: number;
  bookingId: number;
  onSubmit?: () => void;
}

export const CustomerFeedbackForm: React.FC<CustomerFeedbackFormProps> = ({
  customerId,
  bookingId,
  onSubmit
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await customersService.submitFeedback({
        customerId,
        bookingId,
        rating,
        comment
      });
      setSuccess(true);
      setComment('');
      if (onSubmit) {
        onSubmit();
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-4 bg-green-50 text-green-800 rounded-lg">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`p-2 rounded-full ${
                rating >= value ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Comment
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell us about your experience..."
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
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};
