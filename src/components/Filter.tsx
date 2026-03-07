'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter as FilterIcon, ChevronDown } from 'lucide-react';

interface FilterProps {
	types: string[];
	currentType: string | null;
	searchValue: string;
	onTypeChange: (type: string | null) => void;
	onSearchChange: (value: string) => void;
}

export const Filter = ({ types, currentType, searchValue, onTypeChange, onSearchChange }: FilterProps) => {
	return (
		<div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
			<div className='w-full md:w-1/2 relative'>
				<label className='input input-bordered flex items-center gap-2'>
					<Search className='h-5 w-5 opacity-70' />
					<input
						type='text'
						className='grow'
						placeholder='Search Pokemon...'
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
					/>
				</label>
			</div>

			<div className='w-full md:w-1/3 relative'>
				<div className='relative'>
					<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
						<FilterIcon className='h-5 w-5 opacity-70' />
					</div>
					<select
						aria-label='Filter by Type'
						className='select select-bordered w-full pl-10 capitalize'
						value={currentType || ''}
						onChange={(e) => onTypeChange(e.target.value || null)}
					>
						<option value=''>All Types</option>
						{types.map((type) => (
							<option key={type} value={type}>
								{type}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};
