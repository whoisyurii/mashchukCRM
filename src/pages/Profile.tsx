import React from 'react';
import { useForm } from 'react-hook-form';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
}

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    // Handle profile update
    console.log('Update profile:', data);
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 bg-dark-700 hover:bg-dark-600 rounded-full border-2 border-dark-900 transition-colors"
              >
                <Camera className="w-4 h-4 text-gray-300" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Profile Picture</h3>
              <p className="text-sm text-gray-400">
                Upload a profile picture to personalize your account
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              {...register('firstName', {
                required: 'First name is required',
              })}
              error={errors.firstName?.message}
            />

            <Input
              label="Last Name"
              {...register('lastName', {
                required: 'Last name is required',
              })}
              error={errors.lastName?.message}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <div className="pt-4 border-t border-dark-700">
            <div className="flex justify-end gap-4">
              <Button variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Account Security</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
            <div>
              <p className="font-medium text-white">Password</p>
              <p className="text-sm text-gray-400">Last updated 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
            <div>
              <p className="font-medium text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};