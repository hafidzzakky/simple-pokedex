export interface PokemonListResult {
	name: string;
	url: string;
}

export interface Pokemon {
	id: number;
	name: string;
	types: string[];
	image: string;
	stats: {
		name: string;
		value: number;
	}[];
	cries: {
		latest: string;
		legacy: string;
	};
	height: number;
	weight: number;
	abilities: Ability[];
	moves: Move[];
}

export interface Ability {
	name: string;
	isHidden: boolean;
	description?: string;
	shortDescription?: string;
	generation?: string;
}

export interface Move {
	name: string;
	level?: number;
	method: string;
}

export interface PokemonDetail extends Pokemon {
	evolutionChainUrl: string;
	weaknesses: string[];
}

export interface EvolutionNode {
	species_name: string;
	min_level: number;
	trigger_name: string | null;
	item: string | null;
	image: string;
	evolves_to: EvolutionNode[];
}

export interface PokemonState {
	list: PokemonListResult[];
	pokemonDetails: Record<string, PokemonDetail>; // Cache details by name or id
	evolutionChains: Record<string, EvolutionNode>; // Cache by chain ID
	loading: boolean;
	error: string | null;
	nextUrl: string | null;
}

export interface DashboardPokemonDetail {
	id: number;
	name: string;
	types: string[];
	stats: {
		hp: number;
		attack: number;
		defense: number;
		'special-attack': number;
		'special-defense': number;
		speed: number;
	};
	total: number;
	isLegendary: boolean;
	height: number;
	weight: number;
	image: string;
}
