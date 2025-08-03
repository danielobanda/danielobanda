import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CogIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

import { selectCurrentUser } from '../../store/slices/authSlice';
import { selectSidebarOpen, toggleSidebar } from '../../store/slices/uiSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const sidebarOpen = useSelector(selectSidebarOpen);

  const navigation = {
    admin: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Students', href: '/students', icon: UserGroupIcon },
      { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
      { name: 'Classes', href: '/classes', icon: BookOpenIcon },
      { name: 'Subjects', href: '/subjects', icon: BookOpenIcon },
      { name: 'Attendance', href: '/attendance', icon: ClockIcon },
      { name: 'Grades', href: '/grades', icon: ChartBarIcon },
      { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
      { name: 'Settings', href: '/settings', icon: CogIcon },
    ],
    teacher: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Students', href: '/students', icon: UserGroupIcon },
      { name: 'Classes', href: '/classes', icon: BookOpenIcon },
      { name: 'Subjects', href: '/subjects', icon: BookOpenIcon },
      { name: 'Attendance', href: '/attendance', icon: ClockIcon },
      { name: 'Grades', href: '/grades', icon: ChartBarIcon },
      { name: 'Reports', href: '/reports', icon: DocumentTextIcon },
    ],
    student: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Attendance', href: '/attendance', icon: ClockIcon },
      { name: 'Grades', href: '/grades', icon: ChartBarIcon },
      { name: 'Profile', href: '/profile', icon: UserIcon },
    ],
    parent: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Attendance', href: '/attendance', icon: ClockIcon },
      { name: 'Grades', href: '/grades', icon: ChartBarIcon },
    ],
  };

  const userNavigation = navigation[user?.role] || [];

  return (
    <>
      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => dispatch(toggleSidebar())}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="ml-3 text-lg font-bold text-secondary-900">SMS</span>
            </div>
            <button
              className="lg:hidden p-1 rounded-md text-secondary-400 hover:text-secondary-500"
              onClick={() => dispatch(toggleSidebar())}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {userNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={isActive ? 'nav-link-active' : 'nav-link'}
                  onClick={() => window.innerWidth < 1024 && dispatch(toggleSidebar())}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-secondary-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-secondary-500 capitalize">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;