import { TYPE_COLORS } from '@/utils/constants';

interface PokemonTypeBadgeProps {
	type: string;
	className?: string;
}

export const PokemonTypeBadge = ({ type, className = '' }: PokemonTypeBadgeProps) => {
	return (
		<span
			className={`text-white text-[10px] px-2 py-0.5 rounded-full capitalize shadow-sm ${
				TYPE_COLORS[type] || 'bg-gray-500'
			} ${className}`}
		>
			{type}
		</span>
	);
};
