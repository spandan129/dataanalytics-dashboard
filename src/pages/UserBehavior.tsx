import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Tooltip
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { deviceStatsService, DeviceStatsData } from '../services/deviceStatisticsAPICall';
import TrafficSourcesChart from '../components/trafficSourceChart';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

// Color palette
const COLORS = ['#4F46E5', '#818CF8', '#A5B4FC', '#C7D2FE', '#E0E7FF'];

// Utility functions
const formatData = (data: Record<string, number>) =>
  Object.entries(data).map(([name, value]) => ({ name, value }));

const GeographicDistributionMap = ({ locations }) => {
  // Calculate map center
  const calculateMapCenter = (locations) => {
    if (locations.length === 0) return [20, 0];

    const latSum = locations.reduce((sum, loc) => sum + loc.latitude, 0);
    const lonSum = locations.reduce((sum, loc) => sum + loc.longitude, 0);

    return [
      latSum / locations.length, 
      lonSum / locations.length
    ];
  };

  // Find max location count for scaling marker size
  const maxCount = Math.max(...locations.map(loc => loc.count), 1);

  // Custom marker function
  const createMarkerIcon = (count) => {
    const size = Math.max(10, Math.min(40, 10 + (count / maxCount) * 30));
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 50%; 
          background-color: rgba(79, 70, 229, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3)
        ">
          <span style="color: white; font-size: ${size/3}px">${count}</span>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });
  };

  const mapCenter = calculateMapCenter(locations);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h2>
      <div className="h-[500px] rounded-lg overflow-hidden relative">
        <MapContainer 
          center={mapCenter} 
          zoom={3} 
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={createMarkerIcon(location.count)}
            >
              <Popup>
                <div>
                  <strong>Location:</strong> {location.latitude.toFixed(2)}, {location.longitude.toFixed(2)}
                  <br />
                  <strong>Device Count:</strong> {location.count}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export function DeviceStats() {
  const [deviceStatsData, setDeviceStatsData] = useState<DeviceStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceStats = async () => {
      try {
        setIsLoading(true);
        const data = await deviceStatsService.getDeviceStats('DEVICE_STATS');
        setDeviceStatsData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch device statistics');
        setIsLoading(false);
      }
    };

    fetchDeviceStats();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!deviceStatsData) return null;

  // Process location data
  const locationDensity = deviceStatsData.location_data.reduce((acc: any, location: any) => {
    const key = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Unique locations with density
  const uniqueLocations = Object.entries(locationDensity).map(([coords, count]) => {
    const [latitude, longitude] = coords.split(',').map(parseFloat);
    return { latitude, longitude, count: count as number };
  });

  return (
    <div className="space-y-8 font-archivo tracking-wide p-14">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Device Statistics</h1>
        <p className="mt-2 text-gray-600">Analyze device and browser usage</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Operating Systems */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Operating Systems</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatData(deviceStatsData.os_counts)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Browsers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Browsers</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatData(deviceStatsData.browser_counts)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#818CF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Types */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Device Types</h2>
          <div className="h-[18rem]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formatData(deviceStatsData.device_counts)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="42%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                >
                  {formatData(deviceStatsData.device_counts).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Sources Chart */}
        <TrafficSourcesChart referers={deviceStatsData.referrers} />

        {/* Geographic Distribution Leaflet Map */}
        <GeographicDistributionMap 
          locations={uniqueLocations}
        />
      </div>
    </div>
  );
}

export default DeviceStats;