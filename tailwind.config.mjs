/** @type {import('tailwindcss').Config} */
import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.3', letterSpacing: '0.02em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.01em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0.01em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '0.01em', fontWeight: '700' }],
                '4xl': ['2.25rem', { lineHeight: '1.15', letterSpacing: '0.01em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '0.005em', fontWeight: '800' }],
                '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '0.005em', fontWeight: '800' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.002em', fontWeight: '900' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.001em', fontWeight: '900' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.0005em', fontWeight: '900' }],
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Inter', 'sans-serif'],
                paragraph: ['Inter', 'sans-serif'],
                syne: ['Syne', 'sans-serif'],
                orbitron: ['Orbitron', 'sans-serif'],
            },
            colors: {
                'deep-black': '#000000', // Pure Black
                'pure-black': '#000000',
                'dark-gray': '#080808', // Charcoal / Surface
                'muted-gray': '#71717A', // Muted Text
                'light-gray': '#A1A1AA', // Secondary Text
                overlay: 'rgba(255,255,255,0.03)', // Glass effect
                border: 'rgba(255,255,255,0.08)', // Subtle border
                background: '#000000',
                foreground: '#EDEDED', // Primary Text
                primary: {
                    DEFAULT: '#EDEDED',
                    foreground: '#000000',
                },
                secondary: {
                    DEFAULT: '#A1A1AA',
                    foreground: '#000000',
                },
                accent: {
                    DEFAULT: '#6D5DF6', // Soft Purple Glow
                    foreground: '#ffffff',
                },
                'secondary-foreground': '#000000',
                'primary-foreground': '#000000',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },
            animation: {
                shimmer: 'shimmer 8s linear infinite',
                'marquee-slow': 'marquee 25s linear infinite',
                'marquee': 'marquee 20s linear infinite',
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [
        containerQueries,
        typography,
        function ({ addUtilities }) {
            const rotateXUtilities = {};
            const rotateYUtilities = {};
            const rotateZUtilities = {};
            const rotateValues = [0, 5, 10, 15, 20, 30, 45, 75, 90, 180];

            // Generate rotate utilities
            rotateValues.forEach((value) => {
                rotateXUtilities[`.rotate-x-${value}`] = { transform: `rotateX(${value}deg)` };
                rotateXUtilities[`.-rotate-x-${value}`] = { transform: `rotateX(-${value}deg)` };
                rotateYUtilities[`.rotate-y-${value}`] = { transform: `rotateY(${value}deg)` };
                rotateYUtilities[`.-rotate-y-${value}`] = { transform: `rotateY(-${value}deg)` };
                rotateZUtilities[`.rotate-z-${value}`] = { transform: `rotateZ(${value}deg)` };
                rotateZUtilities[`.-rotate-z-${value}`] = { transform: `rotateZ(-${value}deg)` };
            });

            addUtilities({
                ...rotateXUtilities,
                ...rotateYUtilities,
                ...rotateZUtilities,
                '.perspective-1000': { perspective: '1000px' },
                '.perspective-1200': { perspective: '1200px' },
                '.perspective-2000': { perspective: '2000px' },
                '.transform-style-3d': { transformStyle: 'preserve-3d' },
                '.backface-hidden': { backfaceVisibility: 'hidden' },
                '.transform-3d': { transform: 'translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0)) rotateX(var(--tw-rotate-x, 0)) rotateY(var(--tw-rotate-y, 0)) rotateZ(var(--tw-rotate-z, 0)) scaleX(var(--tw-scale-x, 1)) scaleY(var(--tw-scale-y, 1))' },
            });
        }
    ],
}