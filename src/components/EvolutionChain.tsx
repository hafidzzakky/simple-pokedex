'use client';

import Link from 'next/link';
import Image from 'next/image';
import { EvolutionNode } from '@/types/pokemon';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface EvolutionChainProps {
	chain: EvolutionNode;
}

export const EvolutionChain = ({ chain }: EvolutionChainProps) => {
	const renderChain = (node: EvolutionNode) => {
		// Use the pre-fetched image URL from the service
		const imageUrl =
			node.image || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png`; // Fallback

		return (
			<div key={node.species_name} className='flex flex-col md:flex-row items-center gap-4'>
				<Link href={`/pokemon/${node.species_name}`}>
					<motion.div
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
						className='flex flex-col items-center group cursor-pointer'
					>
						<div className='relative w-32 h-32 md:w-40 md:h-40 bg-base-200 rounded-full border-4 border-base-100 shadow-md overflow-hidden transition-colors group-hover:border-primary/50 group-hover:bg-primary/10'>
							<Image
								src={imageUrl}
								alt={node.species_name}
								fill
								className='object-contain p-4 transition-transform duration-300 group-hover:scale-110'
								sizes='(max-width: 768px) 100px, 160px'
							/>
						</div>
						<span className='mt-3 text-lg font-bold capitalize text-base-content group-hover:text-primary transition-colors'>
							{node.species_name}
						</span>
					</motion.div>
				</Link>

				{node.evolves_to.length > 0 && (
					<div className='flex flex-col md:flex-row items-center gap-4'>
						<div className='text-base-content/40'>
							<ArrowRight className='hidden md:block w-8 h-8 animate-pulse text-primary/50' />
							<ChevronDown className='block md:hidden w-8 h-8 animate-pulse text-primary/50' />
						</div>
						<div className='flex flex-col gap-8'>
							{node.evolves_to.map((child) => (
								<div key={child.species_name} className='flex flex-col md:flex-row items-center'>
									{renderChain(child)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className='card bg-base-100 rounded-3xl p-6 md:p-10 shadow-xl border border-base-200 mt-12'
		>
			<h3 className='text-2xl font-bold mb-8 text-center text-base-content flex items-center justify-center gap-2'>
				<span className='bg-primary text-primary-content w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-md'>
					E
				</span>
				Evolution Chain
			</h3>
			<div className='flex flex-col items-center justify-center overflow-x-auto pb-4'>{renderChain(chain)}</div>
		</motion.div>
	);
};
