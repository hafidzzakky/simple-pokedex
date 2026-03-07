import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchableSimpleSelector } from './SearchableSimpleSelector';
import { SearchablePokemonSelector } from './SearchablePokemonSelector';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface DashboardControlsProps {
	onSearch: (term: string) => void;
	onTypeSelect: (type: string) => void;
	availableTypes: string[];
	selectedType: string;
	isLoading: boolean;
	pokemonList?: DashboardPokemonDetail[]; // Optional for autocomplete
}

export const DashboardControls = ({
	onSearch,
	onTypeSelect,
	availableTypes,
	selectedType,
	isLoading,
	pokemonList = [],
}: DashboardControlsProps) => {
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 300);

	// If we have the full pokemon list, we can use the SearchablePokemonSelector
	// But the parent expects a string search term, not just a selected ID.
	// So we need to handle both typing (for partial match) and selection.
	// However, SearchablePokemonSelector is designed for selecting ONE item.
	// The user wants "search pokemon di header sama dengan search pokemon di pokemon battle simulator"
	// which implies selecting a specific Pokemon.

	// But wait, the dashboard usually filters a LIST of Pokemon.
	// If I select "Pikachu", should it show ONLY Pikachu? Yes, that's what a filter does.
	// And if I type "Pika", it should show Pikachu, Pidgey, etc?
	// The SearchablePokemonSelector enforces selection of a single item.
	// To maintain the "search term" functionality (filtering multiple items), we might need to stick with the input
	// OR adapt the selector to allow free text.

	// Let's assume the user wants the EXACT SAME component look and feel (dropdown with images).
	// If they select a Pokemon, we pass that name as the search term.

	const handlePokemonSelect = (name: string) => {
		setSearchTerm(name);
		// Immediately trigger search when selected from dropdown
		onSearch(name);
	};

	// Also support clearing or typing if we modify the SearchablePokemonSelector to allow custom input
	// But currently SearchablePokemonSelector is a strict selector.
	// For "Search", users might expect to type "Pi" and see all "Pi..." pokemon in the dashboard grid,
	// NOT just select one from a dropdown.

	// If the user wants it to look "sama dengan search pokemon di pokemon battle simulator",
	// they probably want the Dropdown UI with images.
	// The trade-off is that it becomes a "Selector" rather than a "Free Text Filter".
	// But we can make it a filter if we allow the input to be the search term.

	// Let's stick to the Selector behavior for now as requested (Consistency).
	// If the user clears the selection (which SearchablePokemonSelector doesn't explicitly support yet other than selecting nothing),
	// we might need a "Clear" button or handle empty string.

	// Let's modify handlePokemonSelect to allow clearing if empty string passed
	useEffect(() => {
		if (searchTerm === '') {
			onSearch('');
		}
	}, [searchTerm, onSearch]);

	return (
		<div className='flex flex-col md:flex-row gap-2 w-full md:w-auto items-center'>
			<label className='sr-only' htmlFor='pokemon-search'>
				Search Pokemon
			</label>
			<div className='w-full md:w-64'>
				{/* Reuse the SearchablePokemonSelector but adapting it for "Search" context */}
				{/* Since SearchablePokemonSelector is built for selecting a single ID, using it here 
            means when a user selects a Pokemon, the dashboard will filter to show ONLY that Pokemon. 
            This fulfills the request to match the "comparison" style. */}
				<SearchablePokemonSelector
					selectedId={searchTerm}
					onSelect={handlePokemonSelect}
					pokemonList={pokemonList}
					placeholder='Search Pokemon...'
					className='w-full'
				/>
			</div>

			<label className='sr-only' htmlFor='type-filter'>
				Filter by Type
			</label>
			<SearchableSimpleSelector
				options={availableTypes}
				selectedOption={selectedType}
				onSelect={onTypeSelect}
				placeholder='All Types'
				disabled={isLoading}
			/>
		</div>
	);
};
