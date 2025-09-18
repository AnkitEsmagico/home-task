import { io } from 'socket.io-client';

let socket;

export function initClientSocket() {
  if (!socket) {
    socket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000');
  }
  return socket;
}

export function getClientSocket() {
  return socket;
}