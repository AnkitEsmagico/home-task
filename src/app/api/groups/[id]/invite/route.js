import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connection';
import Group from '@/models/Group';
import User from '@/models/User';
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

async function sendSMSInvite(phone, groupName, inviteCode) {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
        body: `You're invited to join "${groupName}" on Family Tasks! Download the app and use invite code: ${inviteCode}. ${process.env.NEXT_PUBLIC_APP_URL}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });
      console.log('SMS invite sent successfully');
    } catch (error) {
      console.error('SMS invite error:', error);
    }
  }
}

export async function POST(request, { params }) {
  try {
    await dbConnect();
    const userId = await getUserFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: groupId } = params;
    const { phone } = await request.json();

    // Check if user is admin of the group
    const group = await Group.findById(groupId).populate('creator', 'name');
    if (!group || !group.admins.includes(userId)) {
      return NextResponse.json({ error: 'Not authorized to invite members' }, { status: 403 });
    }

    // Find user by phone
    let invitedUser = await User.findOne({ phone });
    
    if (!invitedUser) {
      // User not registered - send SMS invite
      await sendSMSInvite(phone, group.name, group.inviteCode);
      return NextResponse.json({ 
        message: 'SMS invitation sent to unregistered user',
        type: 'sms_sent'
      });
    }

    // Check if user is already a member
    if (group.members.includes(invitedUser._id)) {
      return NextResponse.json({ error: 'User is already a member' }, { status: 400 });
    }

    // User is registered - send app notification and add to group
    const notification = new Notification({
      title: 'Group Invitation',
      message: `You've been invited to join "${group.name}" by ${group.creator.name}`,
      type: 'group_invite',
      user: invitedUser._id,
      group: group._id,
      data: { groupId: group._id, inviteCode: group.inviteCode }
    });
    await notification.save();

    // Add user to group
    group.members.push(invitedUser._id);
    await group.save();

    // Send real-time notification
    try {
      const io = getSocket();
      io.to(`user-${invitedUser._id}`).emit('group-invite', {
        notification,
        group: { _id: group._id, name: group.name }
      });
    } catch (socketError) {
      console.log('Socket not available:', socketError.message);
    }

    await group.populate('members admins creator', 'name phone avatar');

    return NextResponse.json({ 
      message: 'User invited successfully', 
      group,
      type: 'app_notification'
    });
  } catch (error) {
    console.error('Invite user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}