import axios from 'axios';

export interface DeviceStatsData {
  os_counts: Record<string, number>;
  browser_counts: Record<string, number>;
  device_counts: Record<string, number>;
  location_data: Array<{ latitude: number; longitude: number  }>;
  referrers: Array<{ source: string; count: number }>;
}

export const deviceStatsService = {
  async getDeviceStats(pageName: string): Promise<DeviceStatsData> {
    try {
      const adminId = localStorage.getItem('admin_id') 
    //   const adminId = '674997337508096f9687d53a';
      
      if (!adminId) {
        throw new Error('Admin ID not found in localStorage');
      }

      const response = await axios.get(`http://localhost:8000/dashboard`, {
        params: {
          page_name: pageName,
          admin_id: adminId
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching device statistics:', error);
      throw error;
    }
  }
};