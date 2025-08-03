import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';

const Header = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'New student enrolled',
      message: 'John Doe has been enrolled in Grade 10A',
      time: '5 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Attendance marked',
      message: 'Grade 9B attendance has been marked for today',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Grade submitted',
      message: 'Math test grades for Grade 8A have been submitted',
      time: '2 hours ago',
      unread: false,
    },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 lg:hidden"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          
          {/* Search */}
          <div className="hidden md:block ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search students, teachers, classes..."
                className="block w-80 pl-10 pr-3 py-2 border border-secondary-300 rounded-lg leading-5 bg-white placeholder-secondary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search button for mobile */}
          <button className="md:hidden p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100">
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 relative"
            >
              <BellIcon className="h-5 w-5" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-danger-400"></span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-large border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <h3 className="text-sm font-medium text-secondary-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 cursor-pointer ${
                        notification.unread ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-secondary-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-secondary-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-secondary-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {notification.unread && (
                          <span className="ml-2 h-2 w-2 bg-primary-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center p-1 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100"
            >
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
            </button>

            {/* User menu dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-large border border-secondary-200 z-50">
                <div className="p-4 border-b border-secondary-200">
                  <p className="text-sm font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-secondary-500 capitalize">
                    {user?.role}
                  </p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  >
                    <UserIcon className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                  >
                    <Cog6ToothIcon className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-2 border-secondary-200" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside handlers */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;