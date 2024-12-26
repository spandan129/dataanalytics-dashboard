import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Globe } from 'lucide-react';

export const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [domain, setDomain] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
  
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const response = await axios.post('http://localhost:8000/admin/register', {
          username,
          password,
          domain_name: domain
        });
  
        if (response.data) {
          navigate('/login');
        }
      } catch (err) {
        setError('Registration failed. Please try again.');
      }
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-archivo">
        <div className="w-full max-w-md space-y-8 ">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900 ">Create an account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="domain" className="sr-only">Domain</label>
                <div className="relative z-50 ">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="domain"
                    name="domain"
                    type="text"
                    required
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Domain"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Username"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Password"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[100]">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none rounded-md relative block w-full pl-10 px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Confirm Password"
                  />
                </div>
              </div>
            </div>
  
            {error && (
              <div className="text-center text-red-600">
                {error}
              </div>
            )}
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account? {' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  };

export default Register;