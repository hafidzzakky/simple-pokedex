import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchableSimpleSelectorProps {
	options: string[];
	selectedOption: string;
	onSelect: (option: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	allOptionLabel?: string; // Optional label for "All..." option
}

export const SearchableSimpleSelector = ({
	options,
	selectedOption,
	onSelect,
	placeholder = 'Select...',
	disabled = false,
	className,
	allOptionLabel,
}: SearchableSimpleSelectorProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const wrapperRef = useRef<HTMLDivElement>(null);

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

	const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

	const handleSelect = (option: string) => {
		onSelect(option);
		setIsOpen(false);
		setSearchTerm('');
	};

	return (
		<div className={`relative ${className || 'w-full md:w-40'}`} ref={wrapperRef}>
			<button
				type='button'
				className={`btn btn-sm btn-outline w-full justify-between capitalize font-normal bg-base-100/50 ${
					disabled ? 'btn-disabled' : ''
				}`}
				onClick={() => !disabled && setIsOpen(!isOpen)}
			>
				<span className='truncate'>{selectedOption || placeholder}</span>
				<ChevronDown size={14} className={`opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
			</button>

			{isOpen && (
				<div className='absolute z-50 mt-1 w-full bg-base-200 rounded-box shadow-xl border border-base-300 max-h-60 overflow-y-auto flex flex-col p-1 min-w-[160px]'>
					<div className='p-2 sticky top-0 bg-base-200 z-10 border-b border-base-300'>
						<div className='relative'>
							<Search className='absolute left-2 top-1/2 -translate-y-1/2 opacity-50' size={12} />
							<input
								type='text'
								className='input input-xs input-bordered w-full pl-8'
								placeholder='Filter...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								autoFocus
							/>
						</div>
					</div>
					<ul className='menu menu-compact w-full p-0'>
						{allOptionLabel && (
							<li>
								<button
									type='button'
									className={`capitalize rounded-md py-2 ${selectedOption === '' ? 'active' : ''}`}
									onClick={() => handleSelect('')}
								>
									{allOptionLabel}
								</button>
							</li>
						)}
						{filteredOptions.length > 0 ? (
							filteredOptions.map((opt) => (
								<li key={opt}>
									<button
										type='button'
										className={`capitalize rounded-md py-2 ${selectedOption === opt ? 'active' : ''}`}
										onClick={() => handleSelect(opt)}
									>
										{opt}
									</button>
								</li>
							))
						) : (
							<li className='disabled'>
								<span className='opacity-50 text-xs text-center block py-2'>No match found</span>
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
};
