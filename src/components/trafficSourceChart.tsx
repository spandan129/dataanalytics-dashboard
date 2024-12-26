import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, TooltipProps, LegendProps } from 'recharts';

// Define interface for referer data
interface RefererData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  count: number;
}

const COLORS: string[] = [
  '#0088FE', 
  '#00C49F', 
  '#FFBB28', 
  '#FF8042', 
  '#8884D8', 
  '#FF6384' 
];

interface TrafficSourcesChartProps {
  referers: RefererData[];
}

const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ( referers ) => {
  console.log(referers);
  const sortedReferers = [...referers.referers].sort((a, b) => b.count - a.count);

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as RefererData;
      return (
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
          <p className="font-bold text-gray-800">{`Source: ${data.utm_source}`}</p>
          <p className="text-gray-600">{`Medium: ${data.utm_medium}`}</p>
          <p className="text-gray-600">{`Campaign: ${data.utm_campaign}`}</p>
          <p className="text-blue-600 font-semibold">{`Visits: ${data.count}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend to show more details
  const CustomLegend: React.FC<LegendProps> = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload?.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            className="flex items-center space-x-2"
          >
            <span 
              className="w-4 h-4 inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-700">
              {(entry.payload as unknown as RefererData).utm_source} 
              <span className="text-gray-500 ml-1">
                ({(entry.payload as unknown as RefererData).count})
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Traffic Sources</h2>
      <div className="h-[18rem]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sortedReferers}
              dataKey="count"
              nameKey="utm_source"
              cx="50%"
              cy="44%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
            >
              {sortedReferers.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrafficSourcesChart;