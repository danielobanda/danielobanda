import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [
    'User',
    'Student',
    'Teacher',
    'Class',
    'Subject',
    'Attendance',
    'Grade',
    'Dashboard',
  ],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query({
      query: () => '/auth/profile',
      providesTags: ['User'],
    }),
    
    // Student endpoints
    getStudents: builder.query({
      query: (params = {}) => ({
        url: '/students',
        params,
      }),
      providesTags: ['Student'],
    }),
    getStudent: builder.query({
      query: (id) => `/students/${id}`,
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),
    createStudent: builder.mutation({
      query: (studentData) => ({
        url: '/students',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/students/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),
    deleteStudent: builder.mutation({
      query: (id) => ({
        url: `/students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
    
    // Class endpoints
    getClasses: builder.query({
      query: (params = {}) => ({
        url: '/classes',
        params,
      }),
      providesTags: ['Class'],
    }),
    getClass: builder.query({
      query: (id) => `/classes/${id}`,
      providesTags: (result, error, id) => [{ type: 'Class', id }],
    }),
    createClass: builder.mutation({
      query: (classData) => ({
        url: '/classes',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Class'],
    }),
    updateClass: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/classes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Class', id }],
    }),
    
    // Subject endpoints
    getSubjects: builder.query({
      query: (params = {}) => ({
        url: '/subjects',
        params,
      }),
      providesTags: ['Subject'],
    }),
    createSubject: builder.mutation({
      query: (subjectData) => ({
        url: '/subjects',
        method: 'POST',
        body: subjectData,
      }),
      invalidatesTags: ['Subject'],
    }),
    
    // Attendance endpoints
    getAttendance: builder.query({
      query: (params = {}) => ({
        url: '/attendance',
        params,
      }),
      providesTags: ['Attendance'],
    }),
    markAttendance: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance'],
    }),
    updateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/attendance/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    // Grade endpoints
    getGrades: builder.query({
      query: (params = {}) => ({
        url: '/grades',
        params,
      }),
      providesTags: ['Grade'],
    }),
    createGrade: builder.mutation({
      query: (gradeData) => ({
        url: '/grades',
        method: 'POST',
        body: gradeData,
      }),
      invalidatesTags: ['Grade'],
    }),
    updateGrade: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/grades/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Grade'],
    }),
    
    // Dashboard endpoints
    getDashboardStats: builder.query({
      query: (role) => `/dashboard/stats?role=${role}`,
      providesTags: ['Dashboard'],
    }),
    getRecentActivity: builder.query({
      query: () => '/dashboard/activity',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  
  // Student hooks
  useGetStudentsQuery,
  useGetStudentQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  
  // Class hooks
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  
  // Subject hooks
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  
  // Attendance hooks
  useGetAttendanceQuery,
  useMarkAttendanceMutation,
  useUpdateAttendanceMutation,
  
  // Grade hooks
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  
  // Dashboard hooks
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} = apiSlice;