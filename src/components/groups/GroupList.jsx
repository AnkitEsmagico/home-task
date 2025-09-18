'use client';

import { useState } from 'react';
import { FiPlus, FiUsers, FiSettings } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetGroupsQuery } from '@/store/api/apiSlice';
import CreateGroupModal from './CreateGroupModal';

export default function GroupList({ onSelectGroup, selectedGroupId }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: groups = [], isLoading } = useGetGroupsQuery();

  if (isLoading) {
    return <div className="p-6">Loading groups...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Groups</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <FiPlus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No groups yet. Create your first group to get started!</p>
              <Button onClick={() => setShowCreateModal(true)}>
                <FiPlus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          groups.map((group) => (
            <Card 
              key={group._id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedGroupId === group._id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onSelectGroup?.(group._id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Button variant="ghost" size="icon">
                    <FiSettings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{group.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <FiUsers className="mr-1 h-4 w-4" />
                    {group.members?.length || 0} members
                  </span>
                  <span>Created by {group.creator?.name}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}