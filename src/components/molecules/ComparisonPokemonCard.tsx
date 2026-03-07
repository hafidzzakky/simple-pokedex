import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface ComparisonPokemonCardProps {
	pokemon?: DashboardPokemonDetail;
	color: 'primary' | 'secondary';
	placeholder?: string;
}

export const ComparisonPokemonCard = ({
	pokemon,
	color,
	placeholder = 'Select Pokemon',
}: ComparisonPokemonCardProps) => {
	const ringColorClass = color === 'primary' ? 'ring-primary' : 'ring-secondary';
	const hoverTextClass = color === 'primary' ? 'group-hover:text-primary' : 'group-hover:text-secondary';
	const totalTextColorClass = color === 'primary' ? 'text-primary' : 'text-secondary';

	if (!pokemon) {
		return (
			<div className='flex-1 flex items-center justify-center text-base-content/20 text-sm italic border-2 border-dashed border-base-content/10 rounded-xl min-h-[200px]'>
				{placeholder}
			</div>
		);
	}

	return (
		<Link
			href={`/pokemon/${pokemon.name}?from=dashboard`}
			className='flex-1 flex flex-col items-center justify-center text-center space-y-4 hover:bg-white/5 rounded-xl transition-all cursor-pointer group p-2'
		>
			<div className='avatar'>
				<div
					className={`w-24 h-24 rounded-full ring ${ringColorClass} ring-offset-base-100 ring-offset-2 bg-base-200 shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
				>
					<Image src={pokemon.image} alt={pokemon.name} fill className='object-cover' sizes='96px' />
				</div>
			</div>
			<div>
				<h2 className={`font-bold capitalize text-2xl ${hoverTextClass} transition-colors`}>{pokemon.name}</h2>
				<div className='flex gap-1 mt-2 justify-center flex-wrap'>
					{pokemon.types.map((t) => (
						<PokemonTypeBadge key={t} type={t} className='badge badge-sm border-none' />
					))}
				</div>
			</div>
			<div className='w-full bg-base-100/40 rounded-lg p-3'>
				<div className='text-xs opacity-60 uppercase tracking-widest mb-1'>Total Power</div>
				<div className={`text-3xl font-black ${totalTextColorClass}`}>{pokemon.total}</div>
			</div>
			<div className='w-full grid grid-cols-2 gap-2 text-xs'>
				<div className='flex flex-col bg-base-100/30 p-2 rounded'>
					<span className='opacity-50'>Height</span>
					<span className='font-bold'>{pokemon.height}m</span>
				</div>
				<div className='flex flex-col bg-base-100/30 p-2 rounded'>
					<span className='opacity-50'>Weight</span>
					<span className='font-bold'>{pokemon.weight}kg</span>
				</div>
			</div>
		</Link>
	);
};
