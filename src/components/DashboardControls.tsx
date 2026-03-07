import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface DashboardControlsProps {
	onSearch: (term: string) => void;
	onTypeSelect: (type: string) => void;
	availableTypes: string[];
	selectedType: string;
	isLoading: boolean;
}

export const DashboardControls = ({ onSearch, onTypeSelect, availableTypes, selectedType, isLoading }: DashboardControlsProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// Effect to trigger the search in parent only when debounced value changes
	useEffect(() => {
		onSearch(debouncedSearchTerm);
	}, [debouncedSearchTerm, onSearch]);

	return (
		<div className='flex flex-col md:flex-row gap-2 w-full md:w-auto'>
			<label className='sr-only' htmlFor='pokemon-search'>
				Search Pokemon
			</label>
			<input
				id='pokemon-search'
				type='text'
				placeholder='Search Pokemon...'
				className='input input-sm input-bordered w-full md:max-w-xs bg-base-100/50'
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<label className='sr-only' htmlFor='type-filter'>
				Filter by Type
			</label>
			<select
				id='type-filter'
				className='select select-sm select-bordered w-full md:w-32 capitalize bg-base-100/50'
				value={selectedType}
				onChange={(e) => onTypeSelect(e.target.value)}
				disabled={isLoading}
			>
				<option value=''>All Types</option>
				{availableTypes.map((t) => (
					<option key={t} value={t}>
						{t}
					</option>
				))}
			</select>
		</div>
	);
};
