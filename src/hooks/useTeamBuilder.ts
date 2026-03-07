import { useState, useEffect } from 'react';
import { DashboardPokemonDetail } from '@/types/pokemon';

const STORAGE_KEY = 'pokemon_team';

export const useTeamBuilder = () => {
	const [team, setTeam] = useState<(DashboardPokemonDetail | null)[]>([null, null, null, null, null, null]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from local storage on mount
	useEffect(() => {
		const savedTeam = localStorage.getItem(STORAGE_KEY);
		if (savedTeam) {
			try {
				const parsed = JSON.parse(savedTeam);
				if (Array.isArray(parsed) && parsed.length === 6) {
					setTeam(parsed);
				}
			} catch (e) {
				console.error('Failed to parse team from storage', e);
			}
		}
		setIsLoaded(true);
	}, []);

	// Save to local storage whenever team changes
	useEffect(() => {
		if (isLoaded) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
		}
	}, [team, isLoaded]);

	const addPokemon = (index: number, pokemon: DashboardPokemonDetail) => {
		const newTeam = [...team];
		newTeam[index] = pokemon;
		setTeam(newTeam);
	};

	const removePokemon = (index: number) => {
		const newTeam = [...team];
		newTeam[index] = null;
		setTeam(newTeam);
	};

	const clearTeam = () => {
		setTeam([null, null, null, null, null, null]);
	};

	const teamStats = {
		count: team.filter((p) => p !== null).length,
		avgTotal: Math.round(
			team.reduce((acc, p) => acc + (p?.total || 0), 0) / (team.filter((p) => p !== null).length || 1)
		),
		types: team
			.filter((p): p is DashboardPokemonDetail => p !== null)
			.flatMap((p) => p.types)
			.reduce((acc, type) => {
				acc[type] = (acc[type] || 0) + 1;
				return acc;
			}, {} as Record<string, number>),
	};

	return {
		team,
		isLoaded,
		addPokemon,
		removePokemon,
		clearTeam,
		teamStats,
	};
};
