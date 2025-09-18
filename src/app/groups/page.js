'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '@/components/layout/AppLayout';
import GroupList from '@/components/groups/GroupList';
import GroupDetail from '@/components/groups/GroupDetail';
import { useGetGroupsQuery } from '@/store/api/apiSlice';

export default function GroupsPage() {
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { data: groups = [] } = useGetGroupsQuery();
  
  const selectedGroup = groups.find(g => g._id === selectedGroupId);

  return (
    <AppLayout currentPath="/groups">
      <div className="lg:flex h-full">
        {/* Groups List - Mobile: full width, Desktop: left panel */}
        <div className={`lg:w-1/2 lg:border-r ${selectedGroupId ? 'hidden lg:block' : 'block'}`}>
          <div className="p-4">
            <GroupList onSelectGroup={setSelectedGroupId} selectedGroupId={selectedGroupId} />
          </div>
        </div>
        
        {/* Group Detail - Mobile: full width when selected, Desktop: right panel */}
        <div className={`lg:w-1/2 ${selectedGroupId ? 'block' : 'hidden lg:block'}`}>
          <GroupDetail group={selectedGroup} currentUser={user} />
        </div>
      </div>
    </AppLayout>
  );
}