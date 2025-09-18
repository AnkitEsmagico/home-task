'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiSave } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateProfileMutation } from '@/store/api/apiSlice';
import { setCredentials } from '@/store/slices/authSlice';

export default function ProfileSetup() {
  const { user } = useSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile({ name, avatar }).unwrap();
      dispatch(setCredentials({ user: result.user, token: user.token }));
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const needsSetup = !user?.name;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {needsSetup ? 'Complete Your Profile' : 'Update Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL (Optional)</label>
              <Input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
            </div>

            <div className="text-sm text-gray-500">
              <p>Phone: {user?.phone}</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <FiSave className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : needsSetup ? 'Complete Setup' : 'Update Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}