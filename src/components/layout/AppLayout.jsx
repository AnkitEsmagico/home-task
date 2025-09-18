'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiHome, FiUsers, FiCheckSquare, FiBell, FiLogOut } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { logout } from '@/store/slices/authSlice';
import { useSocket } from '@/hooks/useSocket';
import InstallPWA from '@/components/InstallPWA';

const navigation = [
  { name: 'Dashboard', href: '/', icon: FiHome },
  { name: 'Groups', href: '/groups', icon: FiUsers },
  { name: 'Tasks', href: '/tasks', icon: FiCheckSquare },
  { name: 'Notifications', href: '/notifications', icon: FiBell },
];

export default function AppLayout({ children, currentPath = '/' }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  useSocket();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between p-4 bg-white shadow">
          <h1 className="text-xl font-bold">Family Tasks</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <FiLogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="lg:flex">
        {/* Sidebar */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <div className="flex flex-col flex-grow bg-white shadow-lg">
            <div className="flex items-center h-16 px-4 bg-blue-600">
              <h1 className="text-xl font-bold text-white">Family Tasks</h1>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                      {item.name === 'Notifications' && unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {unreadCount}
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>
              <div className="flex-shrink-0 p-4 border-t">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{user?.phone}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <FiLogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      <InstallPWA />

      {/* Mobile bottom navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <nav className="flex">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-2 px-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
                {item.name === 'Notifications' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}