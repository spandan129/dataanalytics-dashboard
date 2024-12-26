import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, trend}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col font-archivo">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm font-medium">{title}</span>
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="flex items-end justify-between">
        <span className="text-md font-semibold text-gray-900">{value}</span>
        {trend && (
          <span className={`text-sm ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}