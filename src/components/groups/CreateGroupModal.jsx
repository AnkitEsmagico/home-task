'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateGroupMutation } from '@/store/api/apiSlice';

export default function CreateGroupModal({ onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroup({ name, description }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create New Group</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FiX className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="e.g., Family Home"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description (Optional)</label>
              <Input
                placeholder="Brief description of the group"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}