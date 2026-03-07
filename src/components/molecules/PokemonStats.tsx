import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3 } from 'lucide-react';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';
import { PokemonDetail as PokemonDetailType } from '@/types/pokemon';

interface PokemonStatsProps {
	pokemon: PokemonDetailType;
	themeColor: string;
}

export const PokemonStats: React.FC<PokemonStatsProps> = ({ pokemon, themeColor }) => {
	return (
		<div className='flex flex-col gap-6'>
			{/* Weaknesses */}
			{pokemon.weaknesses && pokemon.weaknesses.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='bg-base-100/40 p-5 rounded-2xl border border-base-200/50'
				>
					<h3 className='text-sm font-bold mb-3 text-base-content flex items-center gap-2 uppercase tracking-wider opacity-70'>
						<Shield size={16} /> Weaknesses
					</h3>
					<div className='flex flex-wrap gap-2'>
						{pokemon.weaknesses.map((weakness) => (
							<PokemonTypeBadge
								key={weakness}
								type={weakness}
								className='bg-opacity-90 px-3 py-1 rounded-lg text-xs font-bold'
							/>
						))}
					</div>
				</motion.div>
			)}

			{/* Base Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className='bg-base-100/40 p-5 rounded-2xl border border-base-200/50'
			>
				<h3 className='text-sm font-bold mb-3 text-base-content flex items-center gap-2 uppercase tracking-wider opacity-70'>
					<BarChart3 size={16} /> Base Stats
				</h3>
				<div className='space-y-3'>
					{pokemon.stats.map((stat, index) => (
						<div key={stat.name} className='flex items-center gap-3 text-xs'>
							<span className='w-24 capitalize text-base-content/70 font-medium truncate'>
								{stat.name.replace('-', ' ')}
							</span>
							<div className='relative flex-1 h-2.5 rounded-full overflow-hidden bg-base-200'>
								<div className={`absolute inset-0 ${themeColor} opacity-20`} />
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
									transition={{ delay: 0.5 + index * 0.1, duration: 1, type: 'spring' }}
									className={`h-full rounded-full ${themeColor} shadow-sm relative z-10`}
								/>
							</div>
							<span className='w-8 text-right font-bold text-base-content'>{stat.value}</span>
						</div>
					))}
				</div>
			</motion.div>
		</div>
	);
};
