import { BarChart } from 'lucide-react';

interface PageViewItem {
  path: string;
  count: number;
}

interface PageViewsChartProps {
  data: PageViewItem[];
}

export function PageViewsChart({ data }: PageViewsChartProps) {
  const maxCount = Math.max(...data.map(item => item.count));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 font-archivo">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Page Views Analysis</h3>
        <BarChart className="w-5 h-5 text-indigo-600" />
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const percentage = (item.count / maxCount) * 100;
          return (
            <div key={item.path} className="relative">
              <div className="flex items-center mb-2">
                <span className="w-24 text-sm font-medium text-gray-600">{item.path}</span>
                <div className="flex-1 ml-4">
                  <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    >
                    </div>
                  </div>
                </div>
                <span className="ml-4 text-sm font-semibold text-gray-700">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex justify-between text-sm text-gray-500">
          <span>0</span>
          <span>{Math.round(maxCount / 2).toLocaleString()}</span>
          <span>{maxCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}