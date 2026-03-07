'use client';

import { useState } from 'react';
import { useTeamBuilder } from '@/hooks/useTeamBuilder';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TeamSlot } from '@/components/molecules/TeamSlot';
import { DashboardControls } from '@/components/molecules/DashboardControls';
import { DashboardPokemonDetail } from '@/types/pokemon';
import { X, Save, Trash2, Info, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';
import { TechBackground } from '@/components/atoms/TechBackground';
import { PokeballLoader } from '@/components/atoms/PokeballLoader';
import { PokemonCard } from '@/components/organisms/PokemonCard';

export const TeamBuilder = () => {
	const { team, isLoaded, addPokemon, removePokemon, clearTeam, teamStats } = useTeamBuilder();
	const {
		loading,
		progress,
		selectedGen,
		selectedType,
		filteredPokemonData,
		uniqueTypes,
		handleSearch,
		handleTypeSelect,
		handleGenSelect,
	} = useDashboardData();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

	const handleOpenModal = (index: number) => {
		setActiveSlotIndex(index);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setActiveSlotIndex(null);
	};

	const handleSelectPokemon = (pokemon: DashboardPokemonDetail) => {
		if (activeSlotIndex !== null) {
			addPokemon(activeSlotIndex, pokemon);
			handleCloseModal();
		}
	};

	return (
		<div className='min-h-screen text-base-content relative pb-20'>
			<TechBackground />

			{/* Header */}
			<div className='sticky top-0 z-40 bg-base-100/80 backdrop-blur-md border-b border-base-200/50 w-full shadow-sm'>
				<div className='container mx-auto px-4 py-4 max-w-[1600px]'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
						<div className='flex items-center gap-4'>
							<Link href='/' className='btn btn-ghost btn-sm btn-circle'>
								<ChevronLeft className='h-6 w-6' />
							</Link>
							<div>
								<h1 className='text-2xl font-black text-base-content uppercase tracking-tight'>Team Builder</h1>
								<p className='text-xs text-base-content/60 font-mono'>Build your dream team</p>
							</div>
						</div>

						{/* Team Stats Summary */}
						<div className='flex gap-4 items-center bg-base-100/50 px-4 py-2 rounded-xl border border-base-200/50 w-full md:w-auto justify-center md:justify-start'>
							<div className='text-center'>
								<div className='text-xs text-base-content/40 uppercase font-bold'>Count</div>
								<div className='font-black text-lg'>{teamStats.count}/6</div>
							</div>
							<div className='w-px h-8 bg-base-content/10' />
							<div className='text-center'>
								<div className='text-xs text-base-content/40 uppercase font-bold'>Avg BST</div>
								<div className='font-black text-lg text-primary'>{teamStats.avgTotal}</div>
							</div>
							<div className='w-px h-8 bg-base-content/10' />
							<button
								onClick={clearTeam}
								className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-error/10 hover:bg-error text-error hover:text-white transition-colors text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed'
								disabled={teamStats.count === 0}
							>
								<Trash2 size={14} /> Clear
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='container mx-auto px-4 py-8 max-w-[1600px]'>
				{/* Team Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
					{team.map((pokemon, index) => (
						<TeamSlot key={index} index={index} pokemon={pokemon} onAdd={handleOpenModal} onRemove={removePokemon} />
					))}
				</div>

				{/* Selection Modal */}
				{isModalOpen && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
						<div className='bg-base-100 w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-white/10 relative'>
							{/* Modal Header */}
							<div className='p-6 border-b border-base-200 flex flex-col gap-4 bg-base-100 z-20 relative'>
								<div className='flex justify-between items-center'>
									<h2 className='text-2xl font-bold'>Select Pokemon</h2>
									<button onClick={handleCloseModal} className='btn btn-circle btn-ghost btn-sm hover:bg-base-200'>
										<X size={24} />
									</button>
								</div>

								<DashboardControls
									onSearch={handleSearch}
									onTypeSelect={handleTypeSelect}
									availableTypes={uniqueTypes}
									selectedType={selectedType}
									onGenSelect={handleGenSelect}
									availableGens={['Gen 1', 'Gen 2', 'Gen 3', 'Gen 4', 'Gen 5', 'Gen 6', 'Gen 7', 'Gen 8', 'Gen 9']}
									selectedGen={selectedGen}
									isLoading={loading}
									pokemonList={filteredPokemonData}
								/>
							</div>

							{/* Pokemon Grid */}
							<div className='flex-1 overflow-y-auto p-6 bg-base-200/30 custom-scrollbar'>
								{loading ? (
									<div className='flex flex-col items-center justify-center h-full gap-4'>
										<PokeballLoader showText={false} />
										<p className='text-base-content/50 animate-pulse'>Loading Pokemon Data... {progress}%</p>
									</div>
								) : filteredPokemonData.length === 0 ? (
									<div className='flex flex-col items-center justify-center h-full gap-4 text-base-content/40'>
										<Info size={48} />
										<p>No Pokemon found matching your filters.</p>
									</div>
								) : (
									<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
										{filteredPokemonData.map((pokemon) => (
											<div key={pokemon.id} className='h-full'>
												<PokemonCard
													name={pokemon.name}
													id={pokemon.id}
													image={pokemon.image}
													types={pokemon.types}
													onClick={() => handleSelectPokemon(pokemon)}
													disableLink={true}
												/>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
