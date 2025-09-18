import { NextResponse } from 'next/server';
import { initSocket } from '@/lib/socket/server';

export async function GET() {
  try {
    // Initialize Socket.io server
    const io = initSocket();
    return NextResponse.json({ message: 'Socket.io server initialized' });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize socket' }, { status: 500 });
  }
}