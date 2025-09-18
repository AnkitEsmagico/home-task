'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiUser } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateTaskMutation } from '@/store/api/apiSlice';

export default function CreateTaskModal({ onClose, groupId, groupMembers = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: [],
    dueDate: '',
    priority: 'medium',
    notes: ''
  });

  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask({
        ...formData,
        group: groupId,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null
      }).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleAssigneeChange = (memberId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter(id => id !== memberId)
        : [...prev.assignedTo, memberId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Create New Task</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <FiX className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Task Title</label>
              <Input
                placeholder="e.g., Clean the kitchen"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={3}
                placeholder="Detailed description of the task..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="datetime-local"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign To</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {groupMembers.length === 0 ? (
                  <p className="text-sm text-gray-500">No members available</p>
                ) : (
                  groupMembers.map((member) => (
                    <label key={member._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(member._id)}
                        onChange={() => handleAssigneeChange(member._id)}
                        className="rounded"
                      />
                      <FiUser className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{member.name} ({member.phone})</span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md resize-none"
                rows={2}
                placeholder="Additional notes or instructions..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}