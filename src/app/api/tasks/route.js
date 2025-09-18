import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connection';
import Task from '@/models/Task';
import Notification from '@/models/Notification';
import { getSocket } from '@/lib/socket/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromToken(request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request) {
  try {
    await dbConnect();
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    const tasks = await Task.find({ group: groupId })
      .populate('assignedTo createdBy', 'name phone avatar')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, group, assignedTo, dueDate, priority, notes } = await request.json();
    
    const task = new Task({
      title,
      description,
      group,
      assignedTo,
      createdBy: userId,
      dueDate,
      priority,
      notes,
      activity: [{
        action: 'created',
        user: userId,
        details: 'Task created',
      }]
    });

    await task.save();
    await task.populate('assignedTo createdBy', 'name phone avatar');

    // Create notifications for assigned users
    if (assignedTo && assignedTo.length > 0) {
      const notifications = assignedTo.map(userId => ({
        title: 'New Task Assigned',
        message: `You have been assigned: ${title}`,
        type: 'task_assigned',
        user: userId,
        task: task._id,
        group: group
      }));

      await Notification.insertMany(notifications);

      // Emit real-time notifications
      try {
        const io = getSocket();
        io.to(`group-${group}`).emit('task-assigned', {
          task,
          assignedTo
        });
      } catch (socketError) {
        console.log('Socket not available:', socketError.message);
      }
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}