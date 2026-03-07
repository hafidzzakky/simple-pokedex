import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { DashboardPokemonDetail } from '@/types/pokemon';

interface SearchablePokemonSelectorProps {
	label?: string;
	selectedId: string;
	onSelect: (id: string) => void;
	pokemonList: DashboardPokemonDetail[];
	align?: 'left' | 'right';
	className?: string;
	placeholder?: string;
}

export const SearchablePokemonSelector = ({
	label,
	selectedId,
	onSelect,
	pokemonList,
	align = 'left',
	className = '',
	placeholder = 'Select Pokemon...',
}: SearchablePokemonSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// Filter logic
	const filteredList = pokemonList.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

	// Handle selection
	const handleSelect = (id: string) => {
		onSelect(id);
		setIsOpen(false);
		setSearchTerm('');
	};

	// Get selected Pokemon name
	const selectedPokemon = pokemonList.find((p) => p.name === selectedId);

	return (
		<div className={`form-control relative ${className}`} ref={wrapperRef}>
			{label && (
				<label className='label py-1'>
					<span
						className={`label-text font-bold text-xs uppercase tracking-wider w-full ${
							align === 'right' ? 'text-right text-secondary' : 'text-primary'
						}`}
					>
						{label}
					</span>
				</label>
			)}

			<div className='relative'>
				<div
					role='button'
					tabIndex={0}
					className={`btn btn-sm btn-outline w-full justify-between capitalize font-normal bg-base-100/50 ${
						selectedId ? '' : 'text-base-content/50'
					} ${align === 'right' ? 'text-right' : 'text-left'}`}
					onClick={() => setIsOpen(!isOpen)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							setIsOpen(!isOpen);
						}
					}}
				>
					<span className='truncate mr-2'>{selectedPokemon ? selectedPokemon.name : placeholder}</span>
					{selectedId ? (
						<div
							role='button'
							tabIndex={0}
							className='hover:bg-base-content/20 rounded-full p-1 transition-colors z-10'
							onClick={(e) => {
								e.stopPropagation();
								onSelect('');
								setSearchTerm('');
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									e.stopPropagation();
									onSelect('');
									setSearchTerm('');
								}
							}}
						>
							<X size={14} className='opacity-70' />
						</div>
					) : (
						<Search size={14} className='opacity-50 flex-shrink-0' />
					)}
				</div>

				{isOpen && (
					<div className='absolute z-50 mt-1 w-full bg-base-200 rounded-box shadow-xl border border-base-300 max-h-60 overflow-y-auto flex flex-col p-1'>
						<div className='p-2 sticky top-0 bg-base-200 z-10 border-b border-base-300'>
							<input
								type='text'
								className='input input-xs input-bordered w-full'
								placeholder='Search...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
						</div>
						<ul className='menu menu-compact w-full p-0'>
							{filteredList.length > 0 ? (
								filteredList.map((p) => (
									<li key={p.name}>
										<button
											type='button'
											className={`capitalize rounded-md py-2 ${
												selectedId === p.name ? 'bg-primary text-primary-content font-bold active' : ''
											}`}
											onClick={() => handleSelect(p.name)}
										>
											<div className='flex items-center gap-2'>
												<img src={p.image} alt={p.name} className='w-6 h-6 object-contain' loading='lazy' />
												<span>{p.name}</span>
											</div>
										</button>
									</li>
								))
							) : (
								<li className='pointer-events-auto cursor-default hover:bg-transparent'>
									<span className='opacity-50 text-xs text-center block py-4'>No Pokemon found</span>
								</li>
							)}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};
