import axios from 'axios';

interface AnalyticsData {
  total_visits: number;
  total_visitors: number;
  avg_session_time: string;
  page_view_analysis: {
    [key: string]: number;
  };
  bounce_rate: number;
  total_visits_change_rate: number;
  avg_session_time_change_rate: number;
  total_visitors_change_rate: number;
  total_active_users: number;
}

export const analyticsService = {
  async getDashboardData(pageName: string): Promise<AnalyticsData> {
    try {
    const adminId = localStorage.getItem('admin_id') 

    const accessToken = localStorage.getItem('access_token')
      
      if (!adminId) {
        throw new Error('Admin ID not found in localStorage');
      }

      const response = await axios.get(`http://localhost:8000/dashboard`, {
        params: {
          page_name: pageName,
          admin_id: adminId
        },
        headers: {
          Authorization: `Bearer ${accessToken}` 
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }
};