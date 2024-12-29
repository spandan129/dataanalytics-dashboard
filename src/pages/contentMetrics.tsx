import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell,
  ResponsiveContainer
} from 'recharts';

interface RawContentMetrics {
  video_metrics: Record<string, {
    subscriber: any;
    views: number;
    likes: number;
    avg_watch_time: number;
    avg_completion_rate: number;
  }>;
  content_metrics: Record<string, {
    views: number;
    likes: number;
    avg_scroll_depth: number;
    avg_completion_rate: number;
    cta_clicks: number;
    subscribers: number;
  }>;
  button_clicks: Record<string, number>;
}

const ContentDashboard: React.FC = () => {
  const [contentData, setContentData] = useState<RawContentMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedAdminId = localStorage.getItem('admin_id');

    if (!storedAdminId) {
      setError('No Admin ID found');
      setIsLoading(false);
      return;
    }

    const fetchContentData = async () => {
      try {
        setIsLoading(true);
        const accessToken = localStorage.getItem('access_token')
        const response = await axios.get<RawContentMetrics>('http://localhost:8000/dashboard', {
          params: {
            page_name: 'CONTENT',
            admin_id: storedAdminId
          },
          headers: {
            Authorization: `Bearer ${accessToken}` 
          }
          
        });

        setContentData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch content data');
        setIsLoading(false);
      }
    };

    fetchContentData();
  }, []);

  // Transform video metrics for bar chart
  const videoViewData = contentData
    ? Object.entries(contentData.video_metrics).map(([name, metrics]) => ({
      name,
      views: metrics.views,
      likes: metrics.likes,
      avgWatchTime: metrics.avg_watch_time,
      avgCompletionRate: metrics.avg_completion_rate.toFixed(2),
      subscriber: metrics.subscriber
    }))
    : [];

  // Transform content metrics for bar chart
  const contentViewData = contentData
    ? Object.entries(contentData.content_metrics).map(([name, metrics]) => ({
      name,
      views: metrics.views,
      likes: metrics.likes,
      ctaClicks: metrics.cta_clicks
    }))
    : [];

  // Transform button clicks for pie chart
  const buttonClickData = contentData
    ? Object.entries(contentData.button_clicks).map(([name, clicks]) => ({
      name,
      value: clicks
    }))
    : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center p-6">{error}</div>
  );

  if (!contentData) return null;

  return (
    <div className="container mx-auto p-14 font-archivo">
      <h1 className="text-3xl font-bold mb-6">Content Performance Dashboard</h1>

      <div className="flex flex-col gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Video Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={videoViewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#6366f1" name="Views" />
              <Bar dataKey="likes" fill="#4338ca" name="Likes" />
              <Bar dataKey="avgCompletionRate" fill="#a78bfa" name="Avg Completion Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Content Metrics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentViewData}>
              <CartesianGrid strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#6366f1" name="Views" /> {/* Indigo 500 */}
              <Bar dataKey="likes" fill="#4338ca" name="Likes" /> {/* Indigo 700 */}
              <Bar dataKey="ctaClicks" fill="#a78bfa" name="CTA Clicks" /> {/* Indigo 400 */}
              <Bar dataKey="subscribers" fill="#5b21b6" name="Subscribers" /> {/* Indigo 800 */}
              <Bar dataKey="avgCompletionRate" fill="#818cf8" name="Avg Completion Rate" /> {/* Indigo 600 */}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Button Clicks Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={buttonClickData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#5b21b6"
                dataKey="value"
              >
                {buttonClickData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ContentDashboard;