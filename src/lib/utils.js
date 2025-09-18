import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPriorityColor(priority) {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50';
    case 'medium': return 'text-yellow-600 bg-yellow-50';
    case 'low': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'completed': return 'text-green-600 bg-green-50';
    case 'in_progress': return 'text-blue-600 bg-blue-50';
    case 'denied': return 'text-red-600 bg-red-50';
    case 'not_required': return 'text-gray-600 bg-gray-50';
    default: return 'text-orange-600 bg-orange-50';
  }
}