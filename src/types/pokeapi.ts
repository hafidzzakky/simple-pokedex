export interface PokeAPIPokemonResponse {
	id: number;
	name: string;
	types: {
		slot: number;
		type: {
			name: string;
			url: string;
		};
	}[];
	sprites: {
		front_default: string;
		other: {
			'official-artwork': {
				front_default: string;
			};
		};
	};
	species: {
		name: string;
		url: string;
	};
	abilities: {
		ability: {
			name: string;
			url: string;
		};
		is_hidden: boolean;
		slot: number;
	}[];
	moves: {
		move: {
			name: string;
			url: string;
		};
		version_group_details: {
			level_learned_at: number;
			move_learn_method: {
				name: string;
				url: string;
			};
			version_group: {
				name: string;
				url: string;
			};
		}[];
	}[];
	stats: {
		base_stat: number;
		effort: number;
		stat: {
			name: string;
			url: string;
		};
	}[];
	cries: {
		latest: string;
		legacy: string;
	};
	height: number;
	weight: number;
}

export interface PokeAPITypeResponse {
	damage_relations: {
		double_damage_from: { name: string; url: string }[];
		double_damage_to: { name: string; url: string }[];
		half_damage_from: { name: string; url: string }[];
		half_damage_to: { name: string; url: string }[];
		no_damage_from: { name: string; url: string }[];
		no_damage_to: { name: string; url: string }[];
	};
	pokemon: {
		slot: number;
		pokemon: {
			name: string;
			url: string;
		};
	}[];
}

export interface PokeAPITypeListResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: {
		name: string;
		url: string;
	}[];
}

export interface PokeAPIEvolutionChainResponse {
	chain: PokeAPIEvolutionNode;
}

export interface PokeAPIEvolutionNode {
	is_baby: boolean;
	species: {
		name: string;
		url: string;
	};
	evolution_details: {
		item: {
			name: string;
			url: string;
		} | null;
		trigger: {
			name: string;
			url: string;
		};
		gender: number | null;
		held_item: {
			name: string;
			url: string;
		} | null;
		known_move: {
			name: string;
			url: string;
		} | null;
		known_move_type: {
			name: string;
			url: string;
		} | null;
		location: {
			name: string;
			url: string;
		} | null;
		min_level: number | null;
		min_happiness: number | null;
		min_beauty: number | null;
		min_affection: number | null;
		needs_overworld_rain: boolean;
		party_species: {
			name: string;
			url: string;
		} | null;
		party_type: {
			name: string;
			url: string;
		} | null;
		relative_physical_stats: number | null;
		time_of_day: string;
		trade_species: {
			name: string;
			url: string;
		} | null;
		turn_upside_down: boolean;
	}[];
	evolves_to: PokeAPIEvolutionNode[];
}

export interface PokeAPIAbilityResponse {
	effect_entries: {
		effect: string;
		short_effect: string;
		language: {
			name: string;
			url: string;
		};
	}[];
	generation: {
		name: string;
		url: string;
	};
}
