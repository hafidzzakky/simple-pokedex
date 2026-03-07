'use client';

export const DreamyBackground = () => {
	return (
		<div className='fixed inset-0 -z-50 overflow-hidden pointer-events-none'>
			<div className='absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-primary/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob' />
			<div className='absolute top-[10%] -right-[10%] w-[45vw] h-[45vw] bg-secondary/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000' />
			<div className='absolute -bottom-[10%] -left-[10%] w-[45vw] h-[45vw] bg-accent/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-4000' />
			<div className='absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] bg-secondary/30 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000' />
			<div className='absolute inset-0 bg-transparent backdrop-blur-3xl' />
		</div>
	);
};
