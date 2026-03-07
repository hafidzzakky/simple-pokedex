import axios from 'axios';
import { PokemonDetail, EvolutionNode } from '@/types/pokemon';
import {
	PokeAPIPokemonResponse,
	PokeAPITypeResponse,
	PokeAPIAbilityResponse,
	PokeAPIEvolutionChainResponse,
	PokeAPIEvolutionNode,
	PokeAPITypeListResponse,
} from '@/types/pokeapi';

const API_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
	baseURL: API_URL,
});

export const getPokemonList = async (limit = 20, offset = 0) => {
	const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
	return response.data;
};

export const getPokemonBasicInfo = async (name: string) => {
	const response = await api.get<PokeAPIPokemonResponse>(`/pokemon/${name}`);
	return {
		types: response.data.types.map((t) => t.type.name),
	};
};

export const getPokemonDetail = async (name: string): Promise<PokemonDetail> => {
	const response = await api.get<PokeAPIPokemonResponse>(`/pokemon/${name}`);
	const data = response.data;

	const speciesResponse = await axios.get(data.species.url);
	const evolutionChainUrl = speciesResponse.data.evolution_chain.url;

	// Fetch weaknesses based on types
	const typePromises = data.types.map((t) => axios.get<PokeAPITypeResponse>(t.type.url));
	const typeResponses = await Promise.all(typePromises);

	const multipliers: Record<string, number> = {};

	typeResponses.forEach((res) => {
		const damageRelations = res.data.damage_relations;

		damageRelations.double_damage_from.forEach((d) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 2;
		});

		damageRelations.half_damage_from.forEach((d) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 0.5;
		});

		damageRelations.no_damage_from.forEach((d) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 0;
		});
	});

	const weaknesses = Object.entries(multipliers)
		.filter(([, mult]) => mult >= 2)
		.map(([type]) => type);

	// Fetch Ability Details
	const abilities = await Promise.all(
		data.abilities.map(async (a) => {
			let description = '';
			let shortDescription = '';
			let generation = '';
			try {
				const abRes = await axios.get<PokeAPIAbilityResponse>(a.ability.url);
				const entry = abRes.data.effect_entries.find((e) => e.language.name === 'en');
				description = entry ? entry.effect : 'No description available.';
				shortDescription = entry ? entry.short_effect : 'No short description available.';
				generation = abRes.data.generation.name;
			} catch (e) {
				console.error('Failed to fetch ability description', e);
			}
			return {
				name: a.ability.name,
				isHidden: a.is_hidden,
				description,
				shortDescription,
				generation,
			};
		}),
	);

	// Process Moves (Level-up only)
	const moves = data.moves
		.map((m) => {
			const levelUpDetail = m.version_group_details.find((d) => d.move_learn_method.name === 'level-up');
			if (levelUpDetail) {
				return {
					name: m.move.name,
					level: levelUpDetail.level_learned_at,
					method: 'level-up',
				};
			}
			return null;
		})
		.filter((m) => m !== null)
		.sort((a, b) => (a?.level || 0) - (b?.level || 0)) as { name: string; level: number; method: string }[];

	return {
		id: data.id,
		name: data.name,
		types: data.types.map((t) => t.type.name),
		image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
		stats: data.stats.map((s) => ({
			name: s.stat.name,
			value: s.base_stat,
		})),
		height: data.height,
		weight: data.weight,
		abilities,
		moves,
		evolutionChainUrl,
		weaknesses,
	};
};

export const getEvolutionChain = async (url: string): Promise<EvolutionNode> => {
	const response = await axios.get<PokeAPIEvolutionChainResponse>(url);
	const chain = response.data.chain;

	const processChain = async (node: PokeAPIEvolutionNode): Promise<EvolutionNode> => {
		const speciesName = node.species.name;
		// Fetch image for this species
		let image = '';
		try {
			const pokemonResponse = await api.get<PokeAPIPokemonResponse>(`/pokemon/${speciesName}`);
			image = pokemonResponse.data.sprites.other['official-artwork'].front_default || pokemonResponse.data.sprites.front_default;
		} catch (e) {
			console.error(`Failed to fetch image for ${speciesName}`, e);
		}

		const evolvesTo = await Promise.all(node.evolves_to.map((child) => processChain(child)));

		// Safely access evolution details
		const details = node.evolution_details && node.evolution_details.length > 0 ? node.evolution_details[0] : null;

		return {
			species_name: speciesName,
			min_level: details?.min_level || 0,
			trigger_name: details?.trigger?.name || null,
			item: details?.item?.name || null,
			image,
			evolves_to: evolvesTo,
		};
	};

	return processChain(chain);
};

export const getPokemonTypes = async () => {
	const response = await api.get<PokeAPITypeListResponse>('/type');
	return response.data.results;
};

export const getPokemonByType = async (type: string) => {
	const response = await api.get<PokeAPITypeResponse>(`/type/${type}`);
	return response.data.pokemon.map((p) => p.pokemon);
};
