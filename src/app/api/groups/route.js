import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connection';
import Group from '@/models/Group';
import User from '@/models/User';
import { generateInviteCode } from '@/lib/utils';

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

    const groups = await Group.find({
      $or: [
        { members: userId },
        { admins: userId },
        { creator: userId }
      ]
    }).populate('members admins creator', 'name phone avatar');

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
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

    const { name, description } = await request.json();
    
    const group = new Group({
      name,
      description,
      creator: userId,
      admins: [userId],
      members: [userId],
      inviteCode: generateInviteCode(),
    });

    await group.save();
    await group.populate('members admins creator', 'name phone avatar');

    return NextResponse.json(group);
  } catch (error) {
    console.error('Create group error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}