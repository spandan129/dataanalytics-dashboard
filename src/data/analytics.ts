export interface PageView {
  path: string;
  count: number;
}

export interface AnalyticsData {
  total_visits: number;
  total_visitors: number;
  avg_session_time: string;
  page_view_analysis: PageView[];
  bounce_rate: string;
}

export const analyticsData: AnalyticsData = {
  total_visits: 15420,
  total_visitors: 8750,
  avg_session_time: "4.5min",
  page_view_analysis: [
    { path: "/home", count: 8500 },
    { path: "/products", count: 6200 },
    { path: "/blog", count: 4800 },
    { path: "/about", count: 3200 },
    { path: "/contact", count: 2100 },
    { path: "/pricing", count: 1800 }
  ],
  bounce_rate: "28.5%"
};