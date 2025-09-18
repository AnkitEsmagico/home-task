#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing Family Tasks Application...\n');

// Check if all required files exist
const requiredFiles = [
  'src/app/layout.js',
  'src/app/page.js',
  'src/components/MainApp.jsx',
  'src/store/index.js',
  'src/models/User.js',
  'src/models/Group.js',
  'src/models/Task.js',
  'public/manifest.json',
  'public/sw.js',
  '.env.local'
];

console.log('📁 Checking required files...');
let missingFiles = [];

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file}`);
    missingFiles.push(file);
  }
});

if (missingFiles.length > 0) {
  console.log(`\n❌ Missing ${missingFiles.length} required files. Please ensure all files are created.`);
  process.exit(1);
}

console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  process.exit(1);
}

console.log('\n🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application built successfully');
} catch (error) {
  console.log('❌ Build failed');
  process.exit(1);
}

console.log('\n🎉 Family Tasks Application is ready!');
console.log('\n📋 Next steps:');
console.log('1. Start MongoDB: brew services start mongodb/brew/mongodb-community');
console.log('2. Update .env.local with your MongoDB URI and JWT secret');
console.log('3. Run development server: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('5. Test PWA installation on mobile or desktop');
console.log('\n🔧 Features included:');
console.log('- Phone + OTP Authentication');
console.log('- Group Management');
console.log('- Task Creation & Assignment');
console.log('- Real-time Updates (Socket.io)');
console.log('- Push Notifications');
console.log('- PWA Installation');
console.log('- Responsive Design');
console.log('- Activity Logging');
console.log('- Due Date Reminders');