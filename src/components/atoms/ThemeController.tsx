'use client';

import { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';

const themes = [
	{ name: 'light', icon: '☀️' },
	{ name: 'dark', icon: '🌙' },
	{ name: 'cupcake', icon: '🧁' },
	{ name: 'bumblebee', icon: '🐝' },
	{ name: 'emerald', icon: '✳️' },
	{ name: 'corporate', icon: '🏢' },
	{ name: 'synthwave', icon: '🌃' },
	{ name: 'retro', icon: '📻' },
	{ name: 'cyberpunk', icon: '🤖' },
	{ name: 'valentine', icon: '🌸' },
	{ name: 'halloween', icon: '🎃' },
];

export const ThemeController = () => {
	const [theme, setTheme] = useState('dark');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
		const savedTheme = localStorage.getItem('theme') || 'dark';
		setTheme(savedTheme);
		document.documentElement.setAttribute('data-theme', savedTheme);
	}, []);

	const changeTheme = (newTheme: string) => {
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);
		document.documentElement.setAttribute('data-theme', newTheme);
	};

	if (!mounted) return null;

	return (
		<div className='dropdown dropdown-end fixed top-4 right-4 z-50'>
			<div
				tabIndex={0}
				role='button'
				aria-label='Change Theme'
				className='btn btn-circle btn-ghost bg-base-100 shadow-lg border border-base-300'
			>
				<Palette size={20} />
			</div>
			<ul
				tabIndex={0}
				className='dropdown-content z-[1] menu p-2 shadow-2xl bg-base-200 rounded-box w-52 max-h-96 overflow-y-auto mt-2'
			>
				{themes.map((t) => (
					<li key={t.name}>
						<button
							className={`${theme === t.name ? 'active' : ''} flex justify-between items-center`}
							onClick={() => changeTheme(t.name)}
						>
							<span className='capitalize'>{t.name}</span>
							<span>{t.icon}</span>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};
