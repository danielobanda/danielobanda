import React from 'react';
import {
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  // Mock data - in real app, this would come from API
  const stats = [
    {
      name: 'Total Students',
      value: '1,234',
      change: '+12%',
      changeType: 'increase',
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Teachers',
      value: '87',
      change: '+3%',
      changeType: 'increase',
      icon: AcademicCapIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Classes',
      value: '42',
      change: '0%',
      changeType: 'neutral',
      icon: BookOpenIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Attendance Rate',
      value: '94.2%',
      change: '-2%',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  const enrollmentData = [
    { month: 'Jan', students: 1100 },
    { month: 'Feb', students: 1150 },
    { month: 'Mar', students: 1180 },
    { month: 'Apr', students: 1200 },
    { month: 'May', students: 1220 },
    { month: 'Jun', students: 1234 },
  ];

  const attendanceData = [
    { day: 'Mon', present: 1180, absent: 54 },
    { day: 'Tue', present: 1200, absent: 34 },
    { day: 'Wed', present: 1190, absent: 44 },
    { day: 'Thu', present: 1210, absent: 24 },
    { day: 'Fri', present: 1160, absent: 74 },
  ];

  const gradeDistribution = [
    { name: 'A+', value: 145, color: '#10b981' },
    { name: 'A', value: 230, color: '#059669' },
    { name: 'B+', value: 280, color: '#3b82f6' },
    { name: 'B', value: 320, color: '#6366f1' },
    { name: 'C+', value: 180, color: '#f59e0b' },
    { name: 'C', value: 79, color: '#ef4444' },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'enrollment',
      message: 'New student Sarah Johnson enrolled in Grade 10A',
      time: '2 minutes ago',
      icon: UserGroupIcon,
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Attendance marked for Grade 9B by Ms. Smith',
      time: '15 minutes ago',
      icon: ClockIcon,
    },
    {
      id: 3,
      type: 'grade',
      message: 'Math test grades published for Grade 8A',
      time: '1 hour ago',
      icon: ChartBarIcon,
    },
    {
      id: 4,
      type: 'teacher',
      message: 'New teacher Mr. Davis added to Physics department',
      time: '2 hours ago',
      icon: AcademicCapIcon,
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Parent-Teacher Conference',
      date: 'Dec 15, 2023',
      time: '9:00 AM - 5:00 PM',
      type: 'meeting',
    },
    {
      id: 2,
      title: 'Final Examinations',
      date: 'Dec 18-22, 2023',
      time: 'All Day',
      type: 'exam',
    },
    {
      id: 3,
      title: 'Winter Break Begins',
      date: 'Dec 23, 2023',
      time: 'All Day',
      type: 'holiday',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
        <p className="text-secondary-600 mt-2">
          Welcome back! Here's what's happening at your school today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="card-body">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-secondary-600">{stat.name}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                    <div className={`ml-2 flex items-center text-sm ${
                      stat.changeType === 'increase' 
                        ? 'text-success-600' 
                        : stat.changeType === 'decrease'
                        ? 'text-danger-600'
                        : 'text-secondary-500'
                    }`}>
                      {stat.changeType === 'increase' && <TrendingUpIcon className="h-4 w-4 mr-1" />}
                      {stat.changeType === 'decrease' && <TrendingDownIcon className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Student Enrollment Trend</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Grade Distribution</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attendance Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-secondary-900">Weekly Attendance</h3>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10b981" name="Present" />
              <Bar dataKey="absent" fill="#ef4444" name="Absent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Recent Activities</h3>
          </div>
          <div className="card-body p-0">
            <div className="space-y-4 p-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <activity.icon className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">{activity.message}</p>
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-secondary-200 px-6 py-3">
              <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                View all activities
              </button>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-secondary-900">Upcoming Events</h3>
          </div>
          <div className="card-body p-0">
            <div className="space-y-4 p-6">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-secondary-900">{event.title}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'meeting' 
                        ? 'bg-blue-100 text-blue-800'
                        : event.type === 'exam'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-1">{event.date}</p>
                  <p className="text-xs text-secondary-500">{event.time}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-secondary-200 px-6 py-3">
              <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                View calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;