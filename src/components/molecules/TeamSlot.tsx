import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { DashboardPokemonDetail } from '@/types/pokemon';
import { ComparisonPokemonCard } from '@/components/molecules/ComparisonPokemonCard';

interface TeamSlotProps {
	index: number;
	pokemon: DashboardPokemonDetail | null;
	onAdd: (index: number) => void;
	onRemove: (index: number) => void;
}

export const TeamSlot = ({ index, pokemon, onAdd, onRemove }: TeamSlotProps) => {
	if (!pokemon) {
		return (
			<button
				onClick={() => onAdd(index)}
				className='w-full h-full min-h-[300px] rounded-2xl border-2 border-dashed border-base-content/10 bg-base-100/10 hover:bg-base-100/30 hover:border-primary/50 transition-all flex flex-col items-center justify-center group'
			>
				<div className='w-16 h-16 rounded-full bg-base-content/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all'>
					<Plus className='w-8 h-8 text-base-content/30 group-hover:text-primary transition-colors' />
				</div>
				<span className='text-sm font-bold text-base-content/40 group-hover:text-primary transition-colors'>
					Add Slot #{index + 1}
				</span>
			</button>
		);
	}

	return (
		<div className='relative w-full h-full min-h-[300px] rounded-2xl bg-base-100/40 backdrop-blur-md border border-white/10 shadow-lg group hover:shadow-primary/10 transition-shadow'>
			<button
				onClick={() => onRemove(index)}
				className='absolute top-2 right-2 p-2 rounded-full bg-error/10 hover:bg-error text-error hover:text-white transition-colors z-10 opacity-0 group-hover:opacity-100'
				title='Remove Pokemon'
			>
				<Trash2 className='w-4 h-4' />
			</button>
			<ComparisonPokemonCard pokemon={pokemon} color='primary' />
		</div>
	);
};
