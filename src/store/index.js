import { configureStore } from '@reduxjs/toolkit';
import { api } from './api/apiSlice';
import authSlice from './slices/authSlice';
import groupsSlice from './slices/groupsSlice';
import tasksSlice from './slices/tasksSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authSlice,
    groups: groupsSlice,
    tasks: tasksSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});