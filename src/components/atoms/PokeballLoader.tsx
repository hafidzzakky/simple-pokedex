'use client';

import { motion } from 'framer-motion';

interface PokeballLoaderProps {
	size?: 'sm' | 'md' | 'lg';
	showText?: boolean;
}

export const PokeballLoader = ({ size = 'lg', showText = true }: PokeballLoaderProps) => {
	const dimensions = {
		sm: 'w-8 h-8',
		md: 'w-12 h-12',
		lg: 'w-24 h-24',
	};

	const borderMain = {
		sm: 'border-[2px]',
		md: 'border-[4px]',
		lg: 'border-[8px]',
	};

	const borderMiddle = {
		sm: 'border-b-[2px]',
		md: 'border-b-[4px]',
		lg: 'border-b-[8px]',
	};

	const buttonStyle = {
		sm: 'w-2.5 h-2.5 border-[2px]',
		md: 'w-4 h-4 border-[3px]',
		lg: 'w-8 h-8 border-[6px]',
	};

	return (
		<div className='flex flex-col items-center justify-center gap-4'>
			<motion.div
				className={`relative ${dimensions[size]}`}
				animate={{ rotate: 360 }}
				transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
			>
				{/* Main Ball Body */}
				<div
					className={`w-full h-full rounded-full ${borderMain[size]} border-slate-800 bg-white overflow-hidden relative shadow-2xl box-border`}
				>
					{/* Top Red Half */}
					<div
						className={`absolute top-0 left-0 w-full h-[calc(50%)] bg-red-600 ${borderMiddle[size]} border-slate-800 box-border`}
					></div>
				</div>

				{/* Center Button */}
				<div
					className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${buttonStyle[size]} bg-white border-slate-800 rounded-full z-10 shadow-sm`}
				></div>
			</motion.div>
			{showText && size === 'lg' && (
				<p className='text-base-content/60 font-black animate-pulse tracking-widest text-xs uppercase'>Catching Data...</p>
			)}
		</div>
	);
};
