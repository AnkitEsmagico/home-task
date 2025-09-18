'use client';

import { useState } from 'react';
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetTasksQuery, useGetGroupsQuery } from '@/store/api/apiSlice';
import { formatDate, getPriorityColor, getStatusColor } from '@/lib/utils';
import CreateTaskModal from './CreateTaskModal';

export default function TaskList({ groupId, onSelectTask, selectedTaskId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: tasks = [], isLoading } = useGetTasksQuery(groupId, { skip: !groupId });
  const { data: groups = [] } = useGetGroupsQuery();
  
  const currentGroup = groups.find(g => g._id === groupId);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div className="p-6">Loading tasks...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button onClick={() => setShowCreateModal(true)} disabled={!groupId}>
          <FiPlus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-md bg-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No tasks found. Create your first task!</p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card 
              key={task._id} 
              className={`hover:shadow-md transition-shadow cursor-pointer ${
                selectedTaskId === task._id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => onSelectTask?.(task._id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Assigned to: {task.assignedTo?.map(u => u.name).join(', ') || 'Unassigned'}</span>
                  {task.dueDate && (
                    <span>Due: {formatDate(task.dueDate)}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          groupId={groupId}
          groupMembers={currentGroup?.members || []}
        />
      )}
    </div>
  );
}