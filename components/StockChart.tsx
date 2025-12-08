import React from 'react';
import { 
  AreaChart, Area, 
  BarChart, Bar, 
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

interface StockChartProps {
  data: { date: string; value: number }[];
  color?: string;
  type?: 'area' | 'line' | 'bar';
}

export const StockChart: React.FC<StockChartProps> = ({ data, color = "#00E0FF", type = 'area' }) => {
  const commonProps = {
    data: data,
    margin: { top: 10, right: 0, left: 0, bottom: 0 }
  };

  const renderChart = () => {
    if (type === 'bar') {
      return (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A40" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#6B7280'}}
            minTickGap={30}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            cursor={{fill: '#1E1E30'}}
            contentStyle={{ backgroundColor: '#151525', borderRadius: '12px', border: '1px solid #2A2A40', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#E5E7EB', fontWeight: 600, fontFamily: 'JetBrains Mono' }}
            labelStyle={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </BarChart>
      );
    }

    if (type === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A40" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fontSize: 12, fill: '#6B7280'}}
            minTickGap={30}
          />
          <YAxis hide domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#151525', borderRadius: '12px', border: '1px solid #2A2A40', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#E5E7EB', fontWeight: 600, fontFamily: 'JetBrains Mono' }}
            labelStyle={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}
            formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2} 
            dot={false}
            activeDot={{ r: 6, fill: '#0B0B15', stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      );
    }

    // Default to Area
    return (
      <AreaChart {...commonProps}>
        <defs>
          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2A2A40" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{fontSize: 12, fill: '#6B7280'}}
          minTickGap={30}
        />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#151525', borderRadius: '12px', border: '1px solid #2A2A40', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
          itemStyle={{ color: '#E5E7EB', fontWeight: 600, fontFamily: 'JetBrains Mono' }}
          labelStyle={{ color: '#9CA3AF', fontSize: '12px', marginBottom: '4px' }}
          formatter={(value: number) => [`₹${value.toFixed(2)}`, 'Price']}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fillOpacity={1} 
          fill="url(#colorValue)" 
          strokeWidth={2}
        />
      </AreaChart>
    );
  };

  return (
    <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};