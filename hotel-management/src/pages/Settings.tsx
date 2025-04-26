import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SettingsFormData {
  system: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    bookingAlerts: boolean;
    paymentAlerts: boolean;
    systemUpdates: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiration: number;
    ipWhitelist: string;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
    denseMode: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
}

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
    defaultValues: {
      system: {
        language: 'en',
        timezone: 'UTC+7',
        dateFormat: 'DD/MM/YYYY',
        currency: 'VND',
      },
      notifications: {
        emailNotifications: true,
        pushNotifications: true,
        bookingAlerts: true,
        paymentAlerts: true,
        systemUpdates: true,
      },
      security: {
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiration: 90,
        ipWhitelist: '',
      },
      appearance: {
        theme: 'light',
        sidebarCollapsed: false,
        denseMode: false,
        fontSize: 'medium',
      },
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual settings update logic
      console.log('Settings update:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Settings update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">System Settings</h1>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              {/* System Preferences */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">System Preferences</h2>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="system.language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="system.language"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('system.language')}
                    >
                      <option value="en">English</option>
                      <option value="vi">Tiếng Việt</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="system.timezone" className="block text-sm font-medium text-gray-700">
                      Timezone
                    </label>
                    <select
                      id="system.timezone"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('system.timezone')}
                    >
                      <option value="UTC+7">UTC+7 (Vietnam)</option>
                      <option value="UTC+8">UTC+8 (Singapore/China)</option>
                      <option value="UTC+9">UTC+9 (Japan/Korea)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="system.dateFormat" className="block text-sm font-medium text-gray-700">
                      Date Format
                    </label>
                    <select
                      id="system.dateFormat"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('system.dateFormat')}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="system.currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <select
                      id="system.currency"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('system.currency')}
                    >
                      <option value="VND">VND (₫)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.emailNotifications"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.emailNotifications')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.emailNotifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500 text-sm">Receive important updates via email</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.pushNotifications"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.pushNotifications')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.pushNotifications" className="font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <p className="text-gray-500 text-sm">Receive real-time alerts in your browser</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.bookingAlerts"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.bookingAlerts')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.bookingAlerts" className="font-medium text-gray-700">
                        Booking Alerts
                      </label>
                      <p className="text-gray-500 text-sm">Get notified about new bookings and changes</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.paymentAlerts"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.paymentAlerts')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.paymentAlerts" className="font-medium text-gray-700">
                        Payment Alerts
                      </label>
                      <p className="text-gray-500 text-sm">Get notified about payment updates</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notifications.systemUpdates"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('notifications.systemUpdates')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="notifications.systemUpdates" className="font-medium text-gray-700">
                        System Updates
                      </label>
                      <p className="text-gray-500 text-sm">Get notified about system maintenance and updates</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="security.twoFactorAuth"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('security.twoFactorAuth')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="security.twoFactorAuth" className="font-medium text-gray-700">
                        Two-Factor Authentication
                      </label>
                      <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="security.sessionTimeout" className="block text-sm font-medium text-gray-700">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      id="security.sessionTimeout"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="5"
                      max="120"
                      {...register('security.sessionTimeout')}
                    />
                  </div>

                  <div>
                    <label htmlFor="security.passwordExpiration" className="block text-sm font-medium text-gray-700">
                      Password Expiration (days)
                    </label>
                    <input
                      type="number"
                      id="security.passwordExpiration"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      min="30"
                      max="365"
                      {...register('security.passwordExpiration')}
                    />
                  </div>

                  <div>
                    <label htmlFor="security.ipWhitelist" className="block text-sm font-medium text-gray-700">
                      IP Whitelist
                    </label>
                    <input
                      type="text"
                      id="security.ipWhitelist"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Enter comma-separated IP addresses"
                      {...register('security.ipWhitelist')}
                    />
                    <p className="mt-1 text-sm text-gray-500">Leave empty to allow all IPs</p>
                  </div>
                </div>
              </div>

              {/* Appearance Settings */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Appearance Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="appearance.theme" className="block text-sm font-medium text-gray-700">
                      Theme
                    </label>
                    <select
                      id="appearance.theme"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('appearance.theme')}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="appearance.sidebarCollapsed"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('appearance.sidebarCollapsed')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="appearance.sidebarCollapsed" className="font-medium text-gray-700">
                        Collapsed Sidebar
                      </label>
                      <p className="text-gray-500 text-sm">Show only icons in the sidebar</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="appearance.denseMode"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        {...register('appearance.denseMode')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="appearance.denseMode" className="font-medium text-gray-700">
                        Dense Mode
                      </label>
                      <p className="text-gray-500 text-sm">Compact spacing in lists and tables</p>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="appearance.fontSize" className="block text-sm font-medium text-gray-700">
                      Font Size
                    </label>
                    <select
                      id="appearance.fontSize"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      {...register('appearance.fontSize')}
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 