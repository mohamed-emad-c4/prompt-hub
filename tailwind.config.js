/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f7ff',
                    100: '#e0efff',
                    200: '#c7e0ff',
                    300: '#a4c8ff',
                    400: '#78a9ff',
                    500: '#4589ff',
                    600: '#0f62fe',
                    700: '#0043ce',
                    800: '#002d9c',
                    900: '#001d6c',
                    950: '#001141',
                },
                secondary: {
                    50: '#f2f4ff',
                    100: '#e6eaff',
                    200: '#d1d7ff',
                    300: '#b0baff',
                    400: '#8a96ff',
                    500: '#6b6eff',
                    600: '#5151ff',
                    700: '#3f3fd9',
                    800: '#3535ad',
                    900: '#2e2e8a',
                    950: '#1c1c4d',
                },
                accent: {
                    50: '#f0fdfa',
                    100: '#ccfbf1',
                    200: '#99f6e4',
                    300: '#5eead4',
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                    950: '#042f2e',
                },
                gray: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280',
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                    950: '#030712',
                },
            },
            boxShadow: {
                'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
                'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
                'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            animation: {
                'gradient': 'gradient 8s ease infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            backdropBlur: {
                'xs': '2px',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '65ch',
                        color: 'inherit',
                        a: {
                            color: '#0f62fe',
                            '&:hover': {
                                color: '#0043ce',
                            },
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('@tailwindcss/typography'),
    ],
} 