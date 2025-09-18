import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  if (!io) {
    io = new Server(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-group', (groupId) => {
        socket.join(`group-${groupId}`);
      });

      socket.on('leave-group', (groupId) => {
        socket.leave(`group-${groupId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}