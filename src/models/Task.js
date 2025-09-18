import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dueDate: { type: Date },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'denied', 'not_required'], default: 'pending' },
  attachments: [{ type: String }],
  notes: { type: String },
  activity: [activitySchema]
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);