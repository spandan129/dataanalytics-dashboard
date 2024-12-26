export interface DeviceStats {
  os: string;
  device: string;
  browser: string;
  count: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  country: string;
  users: number;
}

export interface UserBehaviorData {
  device_stats: DeviceStats[];
  locations: Location[];
  referers: Array<{
    source: string;
    count: number;
  }>;
}

export const userBehaviorData: UserBehaviorData = {
  device_stats: [
    { os: "Windows", device: "Desktop", browser: "Chrome", count: 4500 },
    { os: "macOS", device: "Desktop", browser: "Safari", count: 3200 },
    { os: "iOS", device: "Mobile", browser: "Safari", count: 2800 },
    { os: "Android", device: "Mobile", browser: "Chrome", count: 2400 },
    { os: "Linux", device: "Desktop", browser: "Firefox", count: 1200 },
    { os: "iPadOS", device: "Tablet", browser: "Safari", count: 900 }
  ],
  locations: [
    { latitude: 40.7128, longitude: -74.0060, country: "United States", users: 2500 },
    { latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", users: 1800 },
    { latitude: 35.6762, longitude: 139.6503, country: "Japan", users: 1500 },
    { latitude: 22.3193, longitude: 114.1694, country: "Hong Kong", users: 1200 },
    { latitude: -33.8688, longitude: 151.2093, country: "Australia", users: 1000 },
    { latitude: 48.8566, longitude: 2.3522, country: "France", users: 950 },
    { latitude: 19.4326, longitude: -99.1332, country: "Mexico", users: 850 },
    { latitude: -23.5505, longitude: -46.6333, country: "Brazil", users: 800 },
    {latitude: 27.71, longitude: 85.32, country: 'Nepal', users: 1200}
  ],
  referers: [
    { source: "Google", count: 5200 },
    { source: "Facebook", count: 2800 },
    { source: "Instagram", count: 2100 },
    { source: "Twitter", count: 1800 },
    { source: "LinkedIn", count: 1500 },
    { source: "Direct", count: 3600 }
  ]
};