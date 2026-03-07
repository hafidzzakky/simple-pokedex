'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { PokemonDetail as PokemonDetailType } from '@/types/pokemon';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Ruler, Weight, Zap, X, Activity, Target, Crosshair, ChevronLeft, ChevronRight, Shield, BarChart3, Volume2 } from 'lucide-react';
import { TYPE_COLORS } from '@/utils/constants';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';
import { PokemonStats } from '@/components/molecules/PokemonStats';
import { PokeballLoader } from '@/components/atoms/PokeballLoader';

interface PokemonDetailProps {
	pokemon: PokemonDetailType;
}

interface MoveDetail {
	name: string;
	type: string;
	power: number | null;
	accuracy: number | null;
	pp: number;
	damage_class: string;
	effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
	flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export const PokemonDetail = ({ pokemon }: PokemonDetailProps) => {
	const imageUrl =
		pokemon.image ||
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;

	const primaryType = pokemon.types[0];
	const themeColor = TYPE_COLORS[primaryType] || 'bg-gray-500';

	const [selectedMove, setSelectedMove] = useState<MoveDetail | null>(null);
	const [isLoadingMove, setIsLoadingMove] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlaying, setIsPlaying] = useState(false);

	const playCry = () => {
		if (audioRef.current) {
			audioRef.current.volume = 0.5;
			audioRef.current.play();
			setIsPlaying(true);
			audioRef.current.onended = () => setIsPlaying(false);
		}
	};

	const handleMoveClick = async (moveName: string) => {
		setError(null);
		setSelectedMove(null);
		setIsLoadingMove(true);
		setIsModalOpen(true);
		try {
			const res = await axios.get(`https://pokeapi.co/api/v2/move/${moveName}`);
			const data = res.data;

			// Transform flavor text to find English entry
			const flavorTextEntry = data.flavor_text_entries.find((entry: { language: { name: string } }) => entry.language.name === 'en');

			// Transform effect entries to find English entry
			const effectEntry = data.effect_entries.find((entry: { language: { name: string } }) => entry.language.name === 'en');

			setSelectedMove({
				name: data.name,
				type: data.type.name,
				power: data.power,
				accuracy: data.accuracy,
				pp: data.pp,
				damage_class: data.damage_class.name,
				effect_entries: effectEntry ? [effectEntry] : [],
				flavor_text_entries: flavorTextEntry ? [flavorTextEntry] : [],
			});
		} catch (error) {
			console.error('Failed to fetch move detail', error);
			setError('Failed to load move details. Please try again.');
		} finally {
			setIsLoadingMove(false);
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedMove(null);
		setError(null);
	};

	return (
		<>
			<AnimatePresence>
				{isModalOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'
						onClick={closeModal}
					>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.9, opacity: 0 }}
							className='bg-base-100 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative border border-white/10'
							onClick={(e) => e.stopPropagation()}
						>
							<button
								onClick={closeModal}
								className='absolute cursor-pointer top-4 right-4 p-2 rounded-full hover:bg-black/20 text-white transition-colors z-50'
							>
								<X size={24} />
							</button>

							{isLoadingMove ? (
								<div className='p-12 flex flex-col items-center justify-center gap-4'>
									<PokeballLoader showText={false} />
									<p className='text-base-content/60 font-medium animate-pulse'>Loading Move Details...</p>
								</div>
							) : error ? (
								<div className='p-12 flex flex-col items-center justify-center gap-4 text-center'>
									<div className='text-error bg-error/10 p-4 rounded-full'>
										<X size={48} />
									</div>
									<p className='text-base-content/80 font-medium text-lg'>{error}</p>
									<button className='btn btn-ghost btn-sm' onClick={closeModal}>
										Close
									</button>
								</div>
							) : selectedMove ? (
								<div>
									{/* Header */}
									<div className={`p-6 ${TYPE_COLORS[selectedMove.type] || 'bg-gray-500'} relative overflow-hidden`}>
										<div className='absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl' />
										<div className='absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl' />

										<div className='relative z-10'>
											<div className='flex items-center gap-3 mb-2'>
												<span className='bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider'>
													{selectedMove.type}
												</span>
												<span className='bg-black/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider'>
													{selectedMove.damage_class}
												</span>
											</div>
											<h2 className='text-3xl font-black text-white capitalize drop-shadow-md'>
												{selectedMove.name.replace('-', ' ')}
											</h2>
										</div>
									</div>

									{/* Content */}
									<div className='p-6 space-y-6'>
										<div className='grid grid-cols-3 gap-4'>
											<div className='bg-base-200/50 p-3 rounded-2xl text-center border border-base-300'>
												<div className='text-red-500 mb-1 flex justify-center'>
													<Zap size={20} />
												</div>
												<div className='text-xs text-base-content/60 font-bold uppercase tracking-wider mb-1'>
													Power
												</div>
												<div className='text-xl font-black text-base-content'>{selectedMove.power || '-'}</div>
											</div>
											<div className='bg-base-200/50 p-3 rounded-2xl text-center border border-base-300'>
												<div className='text-blue-500 mb-1 flex justify-center'>
													<Target size={20} />
												</div>
												<div className='text-xs text-base-content/60 font-bold uppercase tracking-wider mb-1'>
													Accuracy
												</div>
												<div className='text-xl font-black text-base-content'>
													{selectedMove.accuracy ? `${selectedMove.accuracy}%` : '-'}
												</div>
											</div>
											<div className='bg-base-200/50 p-3 rounded-2xl text-center border border-base-300'>
												<div className='text-green-500 mb-1 flex justify-center'>
													<Activity size={20} />
												</div>
												<div className='text-xs text-base-content/60 font-bold uppercase tracking-wider mb-1'>
													PP
												</div>
												<div className='text-xl font-black text-base-content'>{selectedMove.pp}</div>
											</div>
										</div>

										<div className='bg-base-200/30 p-4 rounded-2xl border border-base-200'>
											<h4 className='text-sm font-bold text-base-content mb-2 flex items-center gap-2'>
												<Crosshair size={16} className='text-primary' /> Description
											</h4>
											<p className='text-base-content/80 text-sm leading-relaxed'>
												{selectedMove.flavor_text_entries.find((e) => e.language.name === 'en')?.flavor_text ||
													'No description available.'}
											</p>
										</div>

										{selectedMove.effect_entries.length > 0 && (
											<div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
												<h4 className='text-sm font-bold text-primary mb-2 flex items-center gap-2'>
													<Zap size={16} /> Effect
												</h4>
												<p className='text-base-content/80 text-xs leading-relaxed'>
													{selectedMove.effect_entries
														.find((e) => e.language.name === 'en')
														?.effect.replace('$effect_chance%', '') || 'No effect description available.'}
												</p>
											</div>
										)}
									</div>
								</div>
							) : null}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className='card bg-base-100/60 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-10 w-full border border-white/20 relative overflow-hidden'
			>
				{/* Background Decoration */}
				<div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none ${themeColor}`} />
				<div
					className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none ${themeColor}`}
				/>

				<div className='flex flex-col md:flex-row gap-12 relative z-10'>
					{/* Image & Stats Section (Left) */}
					<div className='w-full md:w-1/2 flex flex-col gap-6 relative'>
						<div className='flex justify-center items-center py-6'>
							<motion.div
								initial={{ rotate: -10, opacity: 0 }}
								animate={{ rotate: 0, opacity: 1 }}
								transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
								className='relative w-72 h-72 md:w-80 md:h-80'
							>
								<div className='absolute inset-0 bg-base-200/50 rounded-full scale-90 -z-10' />
								<Image src={imageUrl} alt={pokemon.name} fill className='object-contain' priority />
							</motion.div>
						</div>

						{/* Weaknesses */}
						{pokemon.weaknesses && pokemon.weaknesses.length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className='bg-base-100/40 p-5 rounded-2xl border border-base-200/50 hidden md:block'
							>
								<h3 className='text-sm font-bold mb-3 text-base-content flex items-center gap-2 uppercase tracking-wider opacity-70'>
									<Shield size={16} /> Weaknesses
								</h3>
								<div className='flex flex-wrap gap-2'>
									{pokemon.weaknesses.map((weakness) => (
										<PokemonTypeBadge
											key={weakness}
											type={weakness}
											className='bg-opacity-90 px-3 py-1 rounded-lg text-xs font-bold'
										/>
									))}
								</div>
							</motion.div>
						)}

						{/* Base Stats */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5 }}
							className='bg-base-100/40 p-5 rounded-2xl border border-base-200/50 hidden md:block'
						>
							<h3 className='text-sm font-bold mb-3 text-base-content flex items-center gap-2 uppercase tracking-wider opacity-70'>
								<BarChart3 size={16} /> Base Stats
							</h3>
							<div className='space-y-3'>
								{pokemon.stats.map((stat, index) => (
									<div key={stat.name} className='flex items-center gap-3 text-xs'>
										<span className='w-24 capitalize text-base-content/70 font-medium truncate'>
											{stat.name.replace('-', ' ')}
										</span>
										<div className='relative flex-1 h-2.5 rounded-full overflow-hidden bg-base-200'>
											<div className={`absolute inset-0 ${themeColor} opacity-20`} />
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${Math.min((stat.value / 255) * 100, 100)}%` }}
												transition={{ delay: 0.5 + index * 0.1, duration: 1, type: 'spring' }}
												className={`h-full rounded-full ${themeColor} shadow-sm relative z-10`}
											/>
										</div>
										<span className='w-8 text-right font-bold text-base-content'>{stat.value}</span>
									</div>
								))}
							</div>
						</motion.div>
					</div>

					{/* Info Section */}
					<div className='w-full md:w-1/2 flex flex-col justify-center'>
						<motion.div
							initial={{ x: 50, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							<div className='flex flex-col-reverse md:flex-row md:justify-between items-center md:items-end mb-6 gap-4 text-center md:text-left'>
								<div className='flex items-center gap-3'>
									<h1 className='text-5xl font-black capitalize text-base-content tracking-tight'>{pokemon.name}</h1>
									{pokemon.cries?.latest && (
										<>
											<button
												onClick={playCry}
												className={`btn btn-circle btn-ghost ${
													isPlaying ? 'text-primary animate-pulse' : 'text-base-content/50 hover:text-primary'
												}`}
												title='Play Cry'
											>
												<Volume2 size={32} />
											</button>
											<audio ref={audioRef} src={pokemon.cries.latest} className='hidden' />
										</>
									)}
								</div>
								<div className='flex items-center gap-4 md:self-auto'>
									{pokemon.id > 1 && (
										<Link
											href={`/pokemon/${pokemon.id - 1}`}
											className='p-2 rounded-full bg-base-200/50 hover:bg-base-200 text-base-content/60 hover:text-primary transition-all'
											title='Previous Pokemon'
										>
											<ChevronLeft size={24} />
										</Link>
									)}
									<span className='text-3xl text-base-content/20 font-mono font-bold'>
										#{String(pokemon.id).padStart(3, '0')}
									</span>
									{pokemon.id < 1025 && (
										<Link
											href={`/pokemon/${pokemon.id + 1}`}
											className='p-2 rounded-full bg-base-200/50 hover:bg-base-200 text-base-content/60 hover:text-primary transition-all'
											title='Next Pokemon'
										>
											<ChevronRight size={24} />
										</Link>
									)}
								</div>
							</div>

							<div className='flex gap-3 mb-8 justify-center md:justify-start'>
								{pokemon.types.map((type) => (
									<PokemonTypeBadge
										key={type}
										type={type}
										className='px-6 py-2 rounded-full text-base font-bold transform hover:scale-105 transition-transform'
									/>
								))}
							</div>

							<div className='grid grid-cols-2 gap-6 mb-8'>
								<div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-4 p-4 bg-base-100/50 rounded-2xl border border-base-200 shadow-sm text-center md:text-left'>
									<div className='p-3 bg-blue-100 rounded-full text-blue-600'>
										<Ruler size={24} />
									</div>
									<div>
										<span className='text-base-content/60 text-sm block'>Height</span>
										<span className='text-xl font-bold text-base-content'>{pokemon.height / 10} m</span>
									</div>
								</div>
								<div className='flex flex-col md:flex-row items-center md:items-start justify-center gap-2 md:gap-4 p-4 bg-base-100/50 rounded-2xl border border-base-200 shadow-sm text-center md:text-left'>
									<div className='p-3 bg-green-100 rounded-full text-green-600'>
										<Weight size={24} />
									</div>
									<div>
										<span className='text-base-content/60 text-sm block'>Weight</span>
										<span className='text-xl font-bold text-base-content'>{pokemon.weight / 10} kg</span>
									</div>
								</div>
							</div>

							<div className='mb-8'>
								<h3 className='text-lg font-bold mb-3 text-base-content flex items-center gap-2'>
									<Zap size={20} className='text-yellow-500' /> Abilities
								</h3>
								<div className='grid grid-cols-1 gap-3'>
									{pokemon.abilities.map((ability) => (
										<div
											key={ability.name}
											className='bg-base-100/50 border border-base-200 p-4 rounded-xl hover:bg-base-100 transition-colors'
										>
											<div className='flex items-center gap-2 mb-1'>
												<span className='font-bold capitalize text-base-content text-lg'>{ability.name}</span>
												{ability.isHidden && (
													<span className='text-[10px] bg-base-content/10 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold opacity-60'>
														Hidden
													</span>
												)}
												{ability.generation && (
													<span className='text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase tracking-wider font-bold opacity-80 ml-auto'>
														{ability.generation.replace('generation-', 'Gen ')}
													</span>
												)}
											</div>
											<p className='text-sm text-base-content/70 leading-relaxed'>
												{ability.description || 'No description available.'}
											</p>
										</div>
									))}
								</div>
							</div>

							{/* Mobile Stats (Visible only on Mobile, below Abilities) */}
							<div className='block md:hidden mt-6'>
								<PokemonStats pokemon={pokemon} themeColor={themeColor} />
							</div>
						</motion.div>
					</div>
				</div>

				{/* Moves Section (Full Width) */}
				{pokemon.moves && pokemon.moves.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className='mt-8 pt-8 border-t border-white/10 relative z-10'
					>
						<h3 className='text-xl font-bold mb-6 text-base-content flex items-center gap-3'>
							<div className='p-2 bg-purple-100 rounded-lg text-purple-600'>
								<Zap size={24} />
							</div>
							Moves (Level Up)
						</h3>
						<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar'>
							{pokemon.moves.map((move) => (
								<div
									key={move.name}
									onClick={() => handleMoveClick(move.name)}
									className='flex justify-between items-center bg-base-100/40 hover:bg-base-100/80 px-4 py-3 rounded-xl border border-base-200/50 text-sm transition-all duration-300 group cursor-pointer'
								>
									<span className='capitalize font-medium text-base-content/90 group-hover:text-base-content'>
										{move.name.replace('-', ' ')}
									</span>
									<span className='text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-md'>
										Lvl {move.level}
									</span>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</motion.div>
		</>
	);
};
