import React from 'react';

interface ChartTooltipProps {
	active?: boolean;
	payload?: {
		name: string;
		value: number | string;
		color?: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		payload?: any;
	}[];
	label?: string;
}

export const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className='bg-base-100/80 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/10'>
				<p className='font-bold text-sm mb-1'>{label}</p>
				{payload.map((entry, index) => (
					<p key={index} className='text-xs' style={{ color: entry.color }}>
						{entry.name}: {entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};
