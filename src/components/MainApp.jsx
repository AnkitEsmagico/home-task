'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from '@/components/auth/LoginForm';
import ProfileSetup from '@/components/auth/ProfileSetup';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/components/Dashboard';
import { registerServiceWorker, requestNotificationPermission } from '@/lib/pwa';
import { hydrate } from '@/store/slices/authSlice';

export default function MainApp() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isHydrated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(hydrate());
    registerServiceWorker();
    requestNotificationPermission();
  }, [dispatch]);

  if (!isHydrated) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (!user?.name) {
    return <ProfileSetup />;
  }

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}