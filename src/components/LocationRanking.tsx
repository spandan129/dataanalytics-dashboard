import { MapPin } from 'lucide-react';
import { Location } from '../data/userBehavior';

interface LocationRankingProps {
  locations: Location[];
}

export function LocationRanking({ locations }: LocationRankingProps) {
  const sortedLocations = [...locations].sort((a, b) => b.users - a.users);
  const totalUsers = locations.reduce((sum, loc) => sum + loc.users, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Top Locations</h2>
        <MapPin className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="space-y-4">
        {sortedLocations.map((location, index) => {
          const percentage = ((location.users / totalUsers) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-none w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-indigo-600">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {location.country}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {location.users.toLocaleString()} users
                  </span>
                  <span className="text-xs text-gray-500">
                    {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}