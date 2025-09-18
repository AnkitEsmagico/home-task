import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['task_assigned', 'task_due', 'task_completed', 'task_denied', 'group_invite'],
    required: true 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  read: { type: Boolean, default: false },
  data: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);