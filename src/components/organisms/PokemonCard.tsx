'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getPokemonBasicInfo } from '@/services/pokemon';
import { PokemonTypeBadge } from '@/components/atoms/PokemonTypeBadge';

interface PokemonCardProps {
	name: string;
	url?: string;
	id?: number | string;
	types?: string[];
	image?: string;
	onClick?: () => void;
	disableLink?: boolean;
}

export const PokemonCard = ({ name, url, id: propId, types: propTypes, image: propImage, onClick, disableLink }: PokemonCardProps) => {
	const id = propId || (url ? url.split('/').filter(Boolean).pop() : null);
	const imageUrl =
		propImage ||
		(id ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` : '');
	const [types, setTypes] = useState<string[]>(propTypes || []);

	useEffect(() => {
		if (propTypes && propTypes.length > 0) {
			setTypes(propTypes);
			return;
		}

		let isMounted = true;
		const fetchTypes = async () => {
			try {
				const data = await getPokemonBasicInfo(name);
				if (isMounted) {
					setTypes(data.types);
				}
			} catch (error) {
				console.error('Failed to fetch pokemon types', error);
			}
		};

		fetchTypes();

		return () => {
			isMounted = false;
		};
	}, [name, propTypes]);

	const CardContent = (
		<motion.div
			whileHover={{ y: -4 }}
			whileTap={{ scale: 0.98 }}
			className='card bg-base-100/40 backdrop-blur-md shadow-xl hover:shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col items-center p-4 cursor-pointer relative transition-all duration-300'
			onClick={onClick}
		>
			<div className='relative w-32 h-32 mb-4 z-10'>
				<div className='absolute inset-0 bg-base-200/50 rounded-full scale-90 -z-10' />
				{imageUrl && (
					<Image
						src={imageUrl}
						alt={name}
						fill
						className='object-contain p-2'
						sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
						loading='lazy'
					/>
				)}
			</div>

			<div className='mt-auto w-full text-center'>
				<span className='text-base-content/60 text-xs font-mono mb-1 block'>#{String(id).padStart(3, '0')}</span>
				<h3 className='text-lg font-bold capitalize text-base-content tracking-tight mb-2'>{name}</h3>
				<div className='flex gap-1 justify-center flex-wrap'>
					{types.length > 0 ? (
						types.map((type) => <PokemonTypeBadge key={type} type={type} />)
					) : (
						// Skeleton loader for types
						<div className='flex gap-1 justify-center'>
							{[1, 2].map((i) => (
								<div key={i} className='h-4 w-12 bg-base-300 rounded-full animate-pulse' />
							))}
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);

	if (disableLink) {
		return <div className='h-full'>{CardContent}</div>;
	}

	return (
		<Link href={`/pokemon/${name}`} className='block h-full'>
			{CardContent}
		</Link>
	);
};
