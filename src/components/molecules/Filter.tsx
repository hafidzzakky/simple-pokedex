'use client';

import React from 'react';
import { SearchablePokemonSelector } from './SearchablePokemonSelector';
import { SearchableSimpleSelector } from './SearchableSimpleSelector';
import { DashboardPokemonDetail } from '@/types/pokemon';
import { GEN_RANGES } from '@/utils/constants';

interface FilterProps {
	types: string[];
	currentType: string | null;
	searchValue: string;
	selectedGen?: string;
	onTypeChange: (type: string | null) => void;
	onSearchChange: (value: string) => void;
	onGenChange?: (gen: string) => void;
	pokemonList: DashboardPokemonDetail[];
}

export const Filter = ({
	types,
	currentType,
	searchValue,
	selectedGen,
	onTypeChange,
	onSearchChange,
	onGenChange,
	pokemonList,
}: FilterProps) => {
	const handlePokemonSelect = (name: string) => {
		onSearchChange(name);
	};

	const handleTypeSelect = (type: string) => {
		onTypeChange(type === 'All Types' ? null : type);
	};

	const handleGenSelect = (gen: string) => {
		if (onGenChange) {
			onGenChange(gen);
		}
	};

	const genOptions = Object.keys(GEN_RANGES);

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

			<div className='w-full md:w-auto md:ml-auto flex flex-col md:flex-row gap-4 relative'>
				{onGenChange && (
					<SearchableSimpleSelector
						options={genOptions}
						selectedOption={selectedGen || ''}
						onSelect={handleGenSelect}
						placeholder='All Generations'
						className='w-full md:w-48'
						allOptionLabel='All Generations'
					/>
				)}
				<SearchableSimpleSelector
					options={types}
					selectedOption={currentType || ''}
					onSelect={handleTypeSelect}
					placeholder='All Types'
					className='w-full md:w-48'
					allOptionLabel='All Types'
				/>
			</div>
		</div>
	);
};
