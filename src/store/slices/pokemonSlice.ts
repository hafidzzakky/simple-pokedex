import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PokemonListResult, PokemonDetail, EvolutionNode } from '@/types/pokemon';
import { getPokemonList, getPokemonDetail, getEvolutionChain, getPokemonTypes, getPokemonByType } from '@/services/pokemon';

interface PokemonState {
	list: PokemonListResult[]; // The current full list (all or by type)
	pokemonDetails: Record<string, PokemonDetail>;
	evolutionChains: Record<string, EvolutionNode>;
	types: string[];
	loading: boolean;
	error: string | null;
	filter: {
		type: string | null;
		search: string;
	};
}

const initialState: PokemonState = {
	list: [],
	pokemonDetails: {},
	evolutionChains: {},
	types: [],
	loading: false,
	error: null,
	filter: {
		type: null,
		search: '',
	},
};

// Fetch ALL pokemon for client-side filtering
export const fetchAllPokemonAsync = createAsyncThunk('pokemon/fetchAll', async () => {
	const response = await getPokemonList(10000, 0); // Fetch all
	return response.results;
});

export const fetchPokemonByTypeAsync = createAsyncThunk('pokemon/fetchByType', async (type: string) => {
	const response = await getPokemonByType(type);
	return response;
});

export const fetchPokemonDetailAsync = createAsyncThunk('pokemon/fetchDetail', async (name: string) => {
	const response = await getPokemonDetail(name.toLowerCase());
	return response;
});

export const fetchEvolutionChainAsync = createAsyncThunk('pokemon/fetchEvolutionChain', async (url: string) => {
	const response = await getEvolutionChain(url);
	return { url, chain: response };
});

export const fetchTypesAsync = createAsyncThunk('pokemon/fetchTypes', async () => {
	const response = await getPokemonTypes();
	return response;
});

const pokemonSlice = createSlice({
	name: 'pokemon',
	initialState,
	reducers: {
		setFilterType: (state, action: PayloadAction<string | null>) => {
			state.filter.type = action.payload;
		},
		setSearch: (state, action: PayloadAction<string>) => {
			state.filter.search = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch All
			.addCase(fetchAllPokemonAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchAllPokemonAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
			})
			.addCase(fetchAllPokemonAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch pokemon list';
			})
			// Fetch By Type
			.addCase(fetchPokemonByTypeAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPokemonByTypeAsync.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
			})
			.addCase(fetchPokemonByTypeAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch pokemon by type';
			})
			// Detail
			.addCase(fetchPokemonDetailAsync.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchPokemonDetailAsync.fulfilled, (state, action) => {
				state.loading = false;
				// Store with normalized lowercase key
				state.pokemonDetails[action.payload.name.toLowerCase()] = action.payload;
			})
			.addCase(fetchPokemonDetailAsync.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message || 'Failed to fetch pokemon detail';
			})
			// Evolution
			.addCase(fetchEvolutionChainAsync.pending, () => {
				// Optional: set loading for evolution chain separately if needed,
				// but global loading is fine for now as it loads after detail
			})
			.addCase(fetchEvolutionChainAsync.fulfilled, (state, action) => {
				state.evolutionChains[action.payload.url] = action.payload.chain;
			})
			.addCase(fetchEvolutionChainAsync.rejected, (state, action) => {
				// Don't set global error for evolution chain failure, just log it or ignore
				console.error('Failed to fetch evolution chain', action.error);
			})
			// Types
			.addCase(fetchTypesAsync.fulfilled, (state, action) => {
				state.types = action.payload.map((t) => t.name);
			});
	},
});

export const { setFilterType, setSearch, clearError } = pokemonSlice.actions;
export default pokemonSlice.reducer;
