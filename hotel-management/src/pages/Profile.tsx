import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  position: string;
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      phoneNumber: '+84 123 456 789',
      position: 'Hotel Manager',
      bio: 'Experienced hotel manager with a passion for exceptional guest service.',
      notifications: {
        email: true,
        push: true,
      },
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual profile update logic
      console.log('Profile update data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                    src="https://via.placeholder.com/96"
                    alt="Profile"
                  />
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:bg-gray-100">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-white">Admin User</h1>
                  <p className="text-blue-100">Hotel Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('username')}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('email')}
                    />
                  </div>

                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('fullName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('phoneNumber')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position
                    </label>
                    <input
                      type="text"
                      id="position"
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('position')}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      disabled={!isEditing}
                      className={`mt-1 block w-full rounded-md ${
                        isEditing ? 'bg-white' : 'bg-gray-50'
                      } border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('bio')}
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.email"
                        type="checkbox"
                        disabled={!isEditing}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.email')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.email" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500 text-sm">Receive notifications via email</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.push"
                        type="checkbox"
                        disabled={!isEditing}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.push')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.push" className="font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <p className="text-gray-500 text-sm">Receive push notifications</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 