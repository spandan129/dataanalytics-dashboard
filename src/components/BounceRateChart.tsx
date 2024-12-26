import { PieChart } from 'lucide-react';

interface BounceRateData {
  bounce_rate: string;
  bounce_count: {
    [page: string]: number;
  };
}

interface BounceRateChartProps {
  bounceData: BounceRateData;
}

export function BounceRateChart({ bounceData }: BounceRateChartProps) {
  // Parse the overall bounce rate
  const bounceRate = parseFloat(bounceData.bounce_rate);
  const circumference = 2 * Math.PI * 16; // radius is 16 (from viewBox)
  const strokeDasharray = `${(bounceRate / 100) * circumference} ${circumference}`;

  // Extract bounce counts for individual pages
  const pageBounceData = Object.entries(bounceData.bounce_count).map(([page, count]) => ({
    page,
    count
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 font-archivo">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bounce Rate</h3>
        <PieChart className="w-5 h-5 text-indigo-600" />
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full transform -rotate-90" viewBox="-1.5 -1.5 35 35">
            {/* Background circle */}
            <circle
              cx="16"
              cy="16"
              r="16"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="3"
            />
            {/* Progress circle */}
            <circle
              cx="16"
              cy="16"
              r="16"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{bounceRate.toFixed(2)}%</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">of users leave after viewing one page</p>
        
        {/* Page-wise Bounce Counts */}
        <div className="mt-6 w-full">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Bounce Counts by Page</h4>
          <div className="space-y-2">
            {pageBounceData.map(({ page, count }) => (
              <div key={page} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{page}</span>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BounceRateChart;