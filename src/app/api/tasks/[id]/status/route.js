import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connection';
import Task from '@/models/Task';
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

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: taskId } = params;
    const { status } = await request.json();

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update task status
    const oldStatus = task.status;
    task.status = status;
    
    // Add activity log
    task.activity.push({
      action: 'status_changed',
      user: userId,
      details: `Status changed from ${oldStatus} to ${status}`,
    });

    await task.save();
    await task.populate('assignedTo createdBy', 'name phone avatar');

    // Emit real-time update
    try {
      const io = getSocket();
      io.to(`group-${task.group}`).emit('task-updated', task);
    } catch (socketError) {
      console.log('Socket not available:', socketError.message);
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Update task status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}