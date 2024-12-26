import { NavLink } from 'react-router-dom';
import { BarChart2, Users, BarChart, LogOut, FileText, Navigation } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
      </div>
      <nav className="px-4 space-y-1">
      
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <BarChart2 className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/user-behavior"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Users className="w-5 h-5 mr-3" />
          User Behavior
        </NavLink>
        <NavLink
          to="/content-metrics"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <BarChart className="w-5 h-5 mr-3" />
          Content Metrics
        </NavLink>
        <NavLink
          to="/user-journey"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <Navigation className="w-5 h-5 mr-3" />
          User Journey
        </NavLink>
        <NavLink
          to="/documentation"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <FileText className="w-5 h-5 mr-3" />
          Documentation
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`
          }
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </NavLink>
      </nav>
    </aside>
  );
}