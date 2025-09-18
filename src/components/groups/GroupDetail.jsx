'use client';

import { useState } from 'react';
import { FiUsers, FiUserPlus, FiSettings, FiTrash2, FiStar } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInviteToGroupMutation } from '@/store/api/apiSlice';

export default function GroupDetail({ group, currentUser }) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteToGroup, { isLoading }] = useInviteToGroupMutation();

  const isAdmin = group?.admins?.some(admin => admin._id === currentUser?._id);
  const isCreator = group?.creator?._id === currentUser?._id;

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const result = await inviteToGroup({ groupId: group._id, phone: invitePhone }).unwrap();
      
      if (result.type === 'sms_sent') {
        setInviteMessage('SMS invitation sent to unregistered user');
      } else if (result.type === 'app_notification') {
        setInviteMessage('User added to group and notified');
      }
      
      setInvitePhone('');
      setTimeout(() => {
        setShowInviteForm(false);
        setInviteMessage('');
      }, 2000);
    } catch (error) {
      setInviteMessage(error.data?.error || 'Failed to invite user');
      console.error('Failed to invite user:', error);
    }
  };

  if (!group) {
    return (
      <div className="p-6 text-center">
        <FiUsers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Select a group to view details</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
          <p className="text-gray-600">{group.description}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowInviteForm(true)}>
              <FiUserPlus className="mr-2 h-4 w-4" />
              Invite
            </Button>
            <Button variant="outline" size="sm">
              <FiSettings className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="tel"
                  placeholder="Phone number (e.g., +1234567890)"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Inviting...' : 'Invite'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowInviteForm(false)}>
                  Cancel
                </Button>
              </div>
              {inviteMessage && (
                <p className={`text-sm ${inviteMessage.includes('Failed') || inviteMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
                  {inviteMessage}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FiUsers className="mr-2 h-4 w-4" />
            Members ({group.members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {group.members?.map((member) => {
              const memberIsAdmin = group.admins?.some(admin => admin._id === member._id);
              const memberIsCreator = group.creator?._id === member._id;
              
              return (
                <div key={member._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiUsers className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.phone}</p>
                    </div>
                    {memberIsCreator && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <FiStar className="mr-1 h-3 w-3" />
                        Creator
                      </span>
                    )}
                    {memberIsAdmin && !memberIsCreator && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Admin
                      </span>
                    )}
                  </div>
                  
                  {isAdmin && member._id !== currentUser?._id && !memberIsCreator && (
                    <div className="flex gap-1">
                      {!memberIsAdmin && (
                        <Button variant="outline" size="sm">
                          Make Admin
                        </Button>
                      )}
                      {memberIsAdmin && (
                        <Button variant="outline" size="sm">
                          Remove Admin
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <FiTrash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium">Created by:</span>
              <p className="text-gray-600">{group.creator?.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Invite Code:</span>
              <p className="text-gray-600 font-mono">{group.inviteCode}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Total Members:</span>
              <p className="text-gray-600">{group.members?.length || 0}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Admins:</span>
              <p className="text-gray-600">{group.admins?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}