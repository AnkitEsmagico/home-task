import dbConnect from '@/lib/db/connection';
import Task from '@/models/Task';
import Notification from '@/models/Notification';
import { getSocket } from '@/lib/socket/server';

export async function checkDueTasks() {
  try {
    await dbConnect();
    
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Find tasks due within the next hour that are not completed
    const dueTasks = await Task.find({
      dueDate: { $lte: oneHourFromNow, $gte: now },
      status: { $nin: ['completed', 'not_required'] }
    }).populate('assignedTo group');

    for (const task of dueTasks) {
      // Create notifications for assigned users
      const notifications = task.assignedTo.map(user => ({
        title: 'Task Due Soon',
        message: `Task "${task.title}" is due in less than 1 hour`,
        type: 'task_due',
        user: user._id,
        task: task._id,
        group: task.group._id
      }));

      await Notification.insertMany(notifications);

      // Emit real-time notifications
      try {
        const io = getSocket();
        io.to(`group-${task.group._id}`).emit('task-due-reminder', {
          task,
          message: `Task "${task.title}" is due soon`
        });
      } catch (socketError) {
        console.log('Socket not available:', socketError.message);
      }
    }

    console.log(`Processed ${dueTasks.length} due task reminders`);
  } catch (error) {
    console.error('Error checking due tasks:', error);
  }
}

// Run reminder check every 15 minutes
export function startReminderService() {
  setInterval(checkDueTasks, 15 * 60 * 1000);
  console.log('Reminder service started');
}