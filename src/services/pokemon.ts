import axios from 'axios';
import { PokemonDetail, EvolutionNode } from '@/types/pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
	baseURL: API_URL,
});

export const getPokemonList = async (limit = 20, offset = 0) => {
	const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
	return response.data;
};

export const getPokemonDetail = async (name: string): Promise<PokemonDetail> => {
	const response = await api.get(`/pokemon/${name}`);
	const data = response.data;

	// Also fetch species to get evolution chain URL
	const speciesResponse = await axios.get(data.species.url);

	// Fetch weaknesses based on types
	const typePromises = data.types.map((t: any) => axios.get(t.type.url));
	const typeResponses = await Promise.all(typePromises);

	const multipliers: Record<string, number> = {};

	typeResponses.forEach((res) => {
		const damageRelations = res.data.damage_relations;

		damageRelations.double_damage_from.forEach((d: any) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 2;
		});

		damageRelations.half_damage_from.forEach((d: any) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 0.5;
		});

		damageRelations.no_damage_from.forEach((d: any) => {
			multipliers[d.name] = (multipliers[d.name] || 1) * 0;
		});
	});

	const weaknesses = Object.entries(multipliers)
		.filter(([_, mult]) => mult >= 2)
		.map(([type]) => type);

	// Fetch Ability Details
	const abilities = await Promise.all(
		data.abilities.map(async (a: any) => {
			let description = '';
			let shortDescription = '';
			let generation = '';
			try {
				const abRes = await axios.get(a.ability.url);
				const entry = abRes.data.effect_entries.find((e: any) => e.language.name === 'en');
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
		.map((m: any) => {
			const levelUpDetail = m.version_group_details.find((d: any) => d.move_learn_method.name === 'level-up');
			if (levelUpDetail) {
				return {
					name: m.move.name,
					level: levelUpDetail.level_learned_at,
					method: 'level-up',
				};
			}
			return null;
		})
		.filter((m: any) => m !== null)
		.sort((a: any, b: any) => a.level - b.level);

	return {
		id: data.id,
		name: data.name,
		types: data.types.map((t: any) => t.type.name),
		image: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
		stats: data.stats.map((s: any) => ({
			name: s.stat.name,
			value: s.base_stat,
		})),
		height: data.height,
		weight: data.weight,
		abilities,
		moves,
		evolutionChainUrl: speciesResponse.data.evolution_chain.url,
		weaknesses,
	};
};

export const getEvolutionChain = async (url: string): Promise<EvolutionNode> => {
	const response = await axios.get(url);
	const chain = response.data.chain;

	const processChain = async (node: any): Promise<EvolutionNode> => {
		const speciesName = node.species.name;
		// Fetch image for this species
		let image = '';
		try {
			const pokemonResponse = await api.get(`/pokemon/${speciesName}`);
			image = pokemonResponse.data.sprites.other['official-artwork'].front_default || pokemonResponse.data.sprites.front_default;
		} catch (e) {
			console.error(`Failed to fetch image for ${speciesName}`, e);
		}

		const evolvesTo = await Promise.all(node.evolves_to.map((child: any) => processChain(child)));

		return {
			species_name: speciesName,
			min_level: node.evolution_details[0]?.min_level || 0,
			trigger_name: node.evolution_details[0]?.trigger?.name || null,
			item: node.evolution_details[0]?.item?.name || null,
			image,
			evolves_to: evolvesTo,
		};
	};

	return processChain(chain);
};

export const getPokemonTypes = async () => {
	const response = await api.get('/type');
	return response.data.results;
};

export const getPokemonByType = async (type: string) => {
	const response = await api.get(`/type/${type}`);
	return response.data.pokemon.map((p: any) => p.pokemon);
};
