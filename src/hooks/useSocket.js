import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initClientSocket } from '@/lib/socket/client';
import { addNotification } from '@/store/slices/notificationsSlice';
import { updateTask } from '@/store/slices/tasksSlice';

export function useSocket() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.groups);

  useEffect(() => {
    if (!user) return;

    const socket = initClientSocket();

    // Join user's groups
    groups.forEach(group => {
      socket.emit('join-group', group._id);
    });

    // Listen for real-time updates
    socket.on('task-updated', (task) => {
      dispatch(updateTask(task));
    });

    socket.on('new-notification', (notification) => {
      dispatch(addNotification(notification));
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/icons/icon-192x192.png',
        });
      }
    });

    socket.on('task-assigned', (data) => {
      if (data.assignedTo.includes(user._id)) {
        dispatch(addNotification({
          _id: Date.now().toString(),
          title: 'New Task Assigned',
          message: `You have been assigned: ${data.task.title}`,
          type: 'task_assigned',
          read: false,
          createdAt: new Date(),
        }));
      }
    });

    return () => {
      socket.off('task-updated');
      socket.off('new-notification');
      socket.off('task-assigned');
    };
  }, [user, groups, dispatch]);
}