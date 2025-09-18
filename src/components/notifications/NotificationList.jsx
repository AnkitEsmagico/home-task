'use client';

import { FiBell, FiCheck, FiClock, FiUser } from 'react-icons/fi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetNotificationsQuery } from '@/store/api/apiSlice';
import { formatDate } from '@/lib/utils';

export default function NotificationList() {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();

  if (isLoading) {
    return <div className="p-6">Loading notifications...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm">
          <FiCheck className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FiBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications yet.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification._id} className={`${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {notification.type === 'task_assigned' && <FiUser className="h-5 w-5 text-blue-500" />}
                    {notification.type === 'task_due' && <FiClock className="h-5 w-5 text-orange-500" />}
                    {notification.type === 'task_completed' && <FiCheck className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}