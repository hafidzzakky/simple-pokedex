import { render, screen, waitFor } from '@testing-library/react';
import { PokemonCard } from '../../components/organisms/PokemonCard';
import { getPokemonBasicInfo } from '@/services/pokemon';

// Mock the service
jest.mock('@/services/pokemon', () => ({
	getPokemonBasicInfo: jest.fn(),
}));

// Mock Next.js Link
jest.mock('next/link', () => {
	const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
		return <a href={href}>{children}</a>;
	};
	MockLink.displayName = 'Link';
	return MockLink;
});

// Mock Next.js Image
jest.mock('next/image', () => ({
	__esModule: true,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
	default: ({ fill, alt, ...props }: any) => {
		// eslint-disable-next-line @next/next/no-img-element
		return <img alt={alt} {...props} />;
	},
}));

describe('PokemonCard', () => {
	const mockPokemon = {
		name: 'bulbasaur',
		url: 'https://pokeapi.co/api/v2/pokemon/1/',
	};

	beforeEach(() => {
		(getPokemonBasicInfo as jest.Mock).mockResolvedValue({
			types: ['grass', 'poison'],
		});
	});

	it('renders pokemon name', async () => {
		render(<PokemonCard name={mockPokemon.name} url={mockPokemon.url} />);
		expect(screen.getByText('bulbasaur')).toBeInTheDocument();
		expect(screen.getByText('#001')).toBeInTheDocument();

		// Wait for the effect to settle to avoid "act" warning
		await waitFor(() => {
			expect(getPokemonBasicInfo).toHaveBeenCalled();
		});
	});

	it('renders pokemon types after fetch', async () => {
		render(<PokemonCard name={mockPokemon.name} url={mockPokemon.url} />);

		await waitFor(() => {
			expect(screen.getByText('grass')).toBeInTheDocument();
			expect(screen.getByText('poison')).toBeInTheDocument();
		});
	});
});
