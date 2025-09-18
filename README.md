# Family Tasks - Home Task Manager

A full-stack Progressive Web App (PWA) for managing family and home tasks with real-time updates, built with Next.js, Redux Toolkit, MongoDB, and Socket.io.

## Features

### 🔐 Authentication & Users
- Phone number + OTP login/signup
- User profiles with name, phone, and optional avatar
- Secure JWT-based authentication

### 👥 Groups
- Create and manage family/home groups
- Multiple admin support
- Invite members by phone number
- Admin controls for member management

### ✅ Tasks
- Create and assign tasks to group members
- Task fields: title, description, assignees, due date, priority, notes
- Task states: pending, in progress, completed, denied, not required
- Complete activity log for all task actions

### 🔔 Notifications & Reminders
- Real-time push notifications
- Task assignment notifications
- Due date reminders
- Status change notifications for admins

### 📱 PWA Support
- Installable on mobile and desktop
- Offline functionality with service worker
- Native app-like experience
- "Add to Home Screen" support

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit + RTK Query
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT + OTP
- **Icons**: React Icons
- **PWA**: Web App Manifest + Service Worker

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Optional: Twilio account for SMS OTP (for production)

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy `.env.local` and update the values:

```bash
cp .env.local .env.local.example
```

Update `.env.local` with your configuration:

```env
MONGODB_URI=mongodb://localhost:27017/home-tasks
JWT_SECRET=your-super-secret-jwt-key-change-in-production
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community
# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env.local`

### 4. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide

### 🚀 Getting Started

1. **Login/Signup**
   - Enter your phone number
   - Receive OTP (check console in development)
   - Verify OTP to access the app

2. **Create a Group**
   - Click "New Group" on the Groups page
   - Enter group name and description
   - You become the admin automatically

3. **Invite Members**
   - Go to group settings
   - Enter phone numbers to invite
   - Members receive invitation notifications

4. **Create Tasks**
   - Click "New Task" in any group
   - Fill in task details
   - Assign to group members
   - Set due dates and priority

### 📱 PWA Installation

**Mobile (Chrome/Safari)**
1. Open the app in browser
2. Tap browser menu
3. Select "Add to Home Screen"
4. Confirm installation

**Desktop (Chrome/Edge)**
1. Look for install icon in address bar
2. Click "Install Family Tasks"
3. App opens in standalone window

### 🔔 Notifications Testing

1. **Task Assignments**
   - Create task and assign to another user
   - Assignee receives real-time notification

2. **Status Changes**
   - Update task status
   - Admins receive status change notifications

3. **Due Date Reminders**
   - Set task due dates
   - Receive reminders before due time

### 📊 Activity Log

- View complete task history
- Track all status changes
- See who made what changes
- Timestamps for all activities

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and login
- `PUT /api/auth/profile` - Update user profile

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `POST /api/groups/:id/invite` - Invite member

### Tasks
- `GET /api/tasks?groupId=:id` - Get group tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id/status` - Update task status

### Notifications
- `GET /api/notifications` - Get user notifications

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Environment Variables

Set production environment variables:
- Update `MONGODB_URI` for production database
- Set strong `JWT_SECRET`
- Configure Twilio for SMS OTP
- Update `NEXT_PUBLIC_APP_URL`

### 3. Deploy Options

**Vercel (Recommended)**
```bash
npm i -g vercel
vercel --prod
```

**Docker**
```bash
docker build -t family-tasks .
docker run -p 3000:3000 family-tasks
```

### 4. HTTPS Requirement

PWA features require HTTPS in production. Most hosting platforms provide this automatically.

## Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.js       # Root layout
│   └── page.js         # Home page
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── groups/        # Group management
│   ├── tasks/         # Task management
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── lib/               # Utilities
│   ├── db/           # Database connection
│   ├── socket/       # Socket.io setup
│   └── utils.js      # Helper functions
├── models/           # Mongoose models
├── store/           # Redux store
│   ├── api/        # RTK Query API
│   └── slices/     # Redux slices
public/
├── icons/          # PWA icons
├── manifest.json   # PWA manifest
└── sw.js          # Service worker
```

### Adding New Features

1. **New API Endpoint**
   - Create route in `src/app/api/`
   - Add to RTK Query in `src/store/api/`

2. **New Component**
   - Add to appropriate folder in `src/components/`
   - Import and use in pages

3. **Database Model**
   - Create in `src/models/`
   - Import in API routes

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **OTP Not Received**
   - Check console logs in development
   - Verify Twilio configuration
   - Check phone number format

3. **PWA Not Installing**
   - Ensure HTTPS (or localhost)
   - Check manifest.json validity
   - Verify service worker registration

4. **Real-time Updates Not Working**
   - Check Socket.io connection
   - Verify WebSocket support
   - Check network/firewall settings

### Debug Mode

Enable debug logging:

```bash
DEBUG=socket.io* npm run dev
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests if applicable
5. Submit pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check troubleshooting section
2. Search existing issues
3. Create new issue with details

---

**Built with ❤️ using Next.js, Redux Toolkit, MongoDB, and Socket.io**