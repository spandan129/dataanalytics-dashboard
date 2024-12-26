import React, { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { PageViewsChart } from '../components/PageViewsChart';
import { BounceRateChart } from '../components/BounceRateChart';
import { BarChart, Users, Clock,  UserCheck  } from 'lucide-react';
import { analyticsService } from '../services/analyticsAPICall';

export function Dashboard() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await analyticsService.getDashboardData('MAIN');
        setAnalyticsData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getTrendValue = (value: number) => ({
    value: `${value}%`,
    positive: value > 0
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!analyticsData) {
    return null;
  }

  const pageViewData = Object.entries(analyticsData.page_view_analysis).map(([path, count]) => ({
    path,
    count: count as number
  }));

  return (
    <div className='p-14'>
      <header className="mb-8 font-archivo tracking-wide">
        <h1 className="text-3xl font-bold text-gray-900 ">Analytics Dashboard</h1>
        <p className="mt-2 text-gray-600">Monitor your website's performance and user engagement</p>
      </header>
        <div className='flex w-full gap-[1.6rem]'>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-[67%]">
        <StatCard
          title="Total Visits"
          value={analyticsData.total_visits.toLocaleString()}
          icon={BarChart}
          trend={getTrendValue(analyticsData.total_visits_change_rate)}
        />
        <StatCard
          title="Total Visitors"
          value={analyticsData.total_visitors.toLocaleString()}
          icon={Users}
          trend={getTrendValue(analyticsData.total_visitors_change_rate)}
        />
        
        <StatCard
          title="Active Users Currently"
          value={analyticsData.total_active_users}
          icon={UserCheck}
        />
      </div>
      <div className='w-[33%]'>
      <StatCard
          title="Avg. Session Time"
          value={analyticsData.avg_session_time}
          icon={Clock}
          trend={getTrendValue(analyticsData.avg_session_time_change_rate)}
          
        />
      </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PageViewsChart data={pageViewData} />
        </div>
        <div>
          <BounceRateChart bounceData={{bounce_rate : analyticsData.bounce_rate.toString(), bounce_count: analyticsData.bounce_counts_per_page}} />
        </div>
      </div>
    </div>
  );
}