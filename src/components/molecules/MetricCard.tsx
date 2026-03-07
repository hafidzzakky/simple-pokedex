import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
	title: string;
	value: string | number;
	subValue: string;
	data: { value: number }[];
	dataKey: string;
	color: string;
}

export const MetricCard = ({ title, value, subValue, data, dataKey, color }: MetricCardProps) => (
	<div className='bg-base-100/40 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/10 flex flex-col h-full'>
		<h3 className='text-sm text-base-content/60 mb-1'>{title}</h3>
		<div className='flex items-end justify-between mb-2'>
			<span className='text-2xl font-bold'>{value}</span>
			<span className='text-xs text-base-content/50 mb-1'>{subValue}</span>
		</div>
		<div className='h-12 w-full mt-auto'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data}>
					<Line type='monotone' dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	</div>
);
