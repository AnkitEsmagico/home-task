'use client';

import { useState } from 'react';
import { FiClock, FiUser, FiEdit, FiTrash2, FiActivity } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateTaskStatusMutation } from '@/store/api/apiSlice';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'denied', label: 'Denied' },
  { value: 'not_required', label: 'Not Required' }
];

export default function TaskDetail({ task, onClose }) {
  const [updateTaskStatus, { isLoading }] = useUpdateTaskStatusMutation();

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTaskStatus({ taskId: task._id, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (!task) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <div className="flex gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FiEdit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{task.description || 'No description provided'}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FiUser className="mr-2 h-4 w-4" />
              Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Created by:</span>
                <p className="text-gray-600">{task.createdBy?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Assigned to:</span>
                {task.assignedTo?.length > 0 ? (
                  <div className="space-y-1">
                    {task.assignedTo.map(user => (
                      <p key={user._id} className="text-gray-600">{user.name}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Unassigned</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FiClock className="mr-2 h-4 w-4" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Created:</span>
                <p className="text-gray-600">{formatDate(task.createdAt)}</p>
              </div>
              {task.dueDate && (
                <div>
                  <span className="text-sm font-medium">Due:</span>
                  <p className="text-gray-600">{formatDate(task.dueDate)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(status => (
              <Button
                key={status.value}
                variant={task.status === status.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(status.value)}
                disabled={isLoading || task.status === status.value}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {task.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{task.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FiActivity className="mr-2 h-4 w-4" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {task.activity?.length > 0 ? (
              task.activity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-400">{formatDate(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No activity yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}