'use client';

import React from 'react';
import { SearchablePokemonSelector } from './SearchablePokemonSelector';
import { SearchableSimpleSelector } from './SearchableSimpleSelector';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface FilterProps {
	types: string[];
	currentType: string | null;
	searchValue: string;
	onTypeChange: (type: string | null) => void;
	onSearchChange: (value: string) => void;
	pokemonList: DashboardPokemonDetail[];
}

export const Filter = ({ types, currentType, searchValue, onTypeChange, onSearchChange, pokemonList }: FilterProps) => {
	const handlePokemonSelect = (name: string) => {
		onSearchChange(name);
	};

	const handleTypeSelect = (type: string) => {
		onTypeChange(type === 'All Types' ? null : type);
	};

	return (
		<div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
			<div className='w-full md:w-64 relative'>
				<SearchablePokemonSelector
					selectedId={searchValue}
					onSelect={handlePokemonSelect}
					pokemonList={pokemonList}
					placeholder='Search Pokemon...'
					className='w-full'
				/>
			</div>

			<div className='w-full md:w-auto md:ml-auto relative'>
				<SearchableSimpleSelector
					options={['All Types', ...types]}
					selectedOption={currentType || 'All Types'}
					onSelect={handleTypeSelect}
					placeholder='All Types'
					className='w-full md:w-56'
				/>
			</div>
		</div>
	);
};
