import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      let token = getState().auth.token;
      
      // Fallback to localStorage if token not in state
      if (!token && typeof window !== 'undefined') {
        token = localStorage.getItem('auth_token');
      }
      
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Group', 'Task', 'Notification'],
  endpoints: (builder) => ({
    // Auth endpoints
    sendOtp: builder.mutation({
      query: (phone) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: { phone },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: { phone, otp },
      }),
      invalidatesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Groups endpoints
    getGroups: builder.query({
      query: () => '/groups',
      providesTags: ['Group'],
    }),
    createGroup: builder.mutation({
      query: (data) => ({
        url: '/groups',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Group'],
    }),
    inviteToGroup: builder.mutation({
      query: ({ groupId, phone }) => ({
        url: `/groups/${groupId}/invite`,
        method: 'POST',
        body: { phone },
      }),
      invalidatesTags: ['Group'],
    }),
    
    // Tasks endpoints
    getTasks: builder.query({
      query: (groupId) => `/tasks?groupId=${groupId}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation({
      query: (data) => ({
        url: '/tasks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ taskId, status }) => ({
        url: `/tasks/${taskId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Task'],
    }),
    
    // Notifications endpoints
    getNotifications: builder.query({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUpdateProfileMutation,
  useGetGroupsQuery,
  useCreateGroupMutation,
  useInviteToGroupMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useGetNotificationsQuery,
} = api;