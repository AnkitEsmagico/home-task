'use client';

import AppLayout from '@/components/layout/AppLayout';
import NotificationList from '@/components/notifications/NotificationList';

export default function NotificationsPage() {
  return (
    <AppLayout currentPath="/notifications">
      <NotificationList />
    </AppLayout>
  );
}