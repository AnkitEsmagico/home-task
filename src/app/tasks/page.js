'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import TaskList from '@/components/tasks/TaskList';
import TaskDetail from '@/components/tasks/TaskDetail';
import { useGetGroupsQuery, useGetTasksQuery } from '@/store/api/apiSlice';

export default function TasksPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const { data: groups = [] } = useGetGroupsQuery();
  const { data: tasks = [] } = useGetTasksQuery(selectedGroupId, { skip: !selectedGroupId });
  
  const selectedTask = tasks.find(t => t._id === selectedTaskId);

  // Auto-select first group if none selected
  useState(() => {
    if (groups.length > 0 && !selectedGroupId) {
      setSelectedGroupId(groups[0]._id);
    }
  }, [groups, selectedGroupId]);

  return (
    <AppLayout currentPath="/tasks">
      <div className="lg:flex h-full">
        {/* Task List - Mobile: full width, Desktop: left panel */}
        <div className={`lg:w-1/2 lg:border-r ${selectedTaskId ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4 border-b">
            <select
              value={selectedGroupId || ''}
              onChange={(e) => {
                setSelectedGroupId(e.target.value);
                setSelectedTaskId(null);
              }}
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">Select a group</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>{group.name}</option>
              ))}
            </select>
          </div>
          <TaskList 
            groupId={selectedGroupId} 
            onSelectTask={setSelectedTaskId}
            selectedTaskId={selectedTaskId}
          />
        </div>
        
        {/* Task Detail - Mobile: full width when selected, Desktop: right panel */}
        <div className={`lg:w-1/2 ${selectedTaskId ? 'block' : 'hidden lg:block'}`}>
          <TaskDetail task={selectedTask} />
        </div>
      </div>
    </AppLayout>
  );
}