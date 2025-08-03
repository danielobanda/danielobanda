import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900">Create Account</h2>
          <p className="mt-2 text-sm text-secondary-600">
            Join the Student Management System
          </p>
        </div>
        
        <div className="card">
          <div className="card-body">
            <p className="text-secondary-600 text-center">Registration form coming soon...</p>
            <div className="mt-4 text-center">
              <Link to="/login" className="text-primary-600 hover:text-primary-500">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;