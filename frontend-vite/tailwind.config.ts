import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'
import typography from '@tailwindcss/typography'

const config: Config = {
    darkMode: ['class'],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter',
    				'-apple-system',
    				'BlinkMacSystemFont',
    				'Segoe UI',
    				'sans-serif'
    			],
    			mono: [
    				'JetBrains Mono',
    				'Fira Code',
    				'Consolas',
    				'monospace'
    			],
    			heading: [
    				'Space Grotesk',
    				'Inter',
    				'sans-serif'
    			],
    			serif: [
    				'Cormorant Garamond',
    				'serif'
    			]
    		},
    		colors: {
    			'bg-primary': '#0A0E27',
    			'bg-secondary': '#151934',
    			'bg-tertiary': '#1E2440',
    			'bg-elevated': '#252B4D',
    			'text-primary': '#E8EAED',
    			'text-secondary': '#B4B7C9',
    			'text-tertiary': '#7A7E9A',
    			'text-disabled': '#4A4E6A',
    			'accent-blue': '#3B82F6',
    			'accent-purple': '#8B5CF6',
    			'accent-green': '#10B981',
    			'accent-amber': '#F59E0B',
    			'accent-red': '#EF4444',
    			'accent-cyan': '#06B6D4',
    			'syntax-keyword': '#FF79C6',
    			'syntax-string': '#50FA7B',
    			'syntax-number': '#BD93F9',
    			'syntax-comment': '#6272A4',
    			'syntax-function': '#8BE9FD',
    			'syntax-variable': '#F8F8F2',
    			'syntax-tag': '#FFB86C',
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: 'hsl(var(--background))',
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsl(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		fontSize: {
    			xs: [
    				'0.75rem',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			sm: [
    				'0.875rem',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			base: [
    				'1rem',
    				{
    					lineHeight: '1.75'
    				}
    			],
    			lg: [
    				'1.125rem',
    				{
    					lineHeight: '1.75'
    				}
    			],
    			xl: [
    				'1.25rem',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			'2xl': [
    				'1.5rem',
    				{
    					lineHeight: '1.5'
    				}
    			],
    			'3xl': [
    				'1.875rem',
    				{
    					lineHeight: '1.25'
    				}
    			],
    			'4xl': [
    				'2.25rem',
    				{
    					lineHeight: '1.25'
    				}
    			],
    			'5xl': [
    				'3rem',
    				{
    					lineHeight: '1.25'
    				}
    			],
    			'6xl': [
    				'3.75rem',
    				{
    					lineHeight: '1.25'
    				}
    			]
    		},
    		letterSpacing: {
    			tighter: '-0.02em',
    			tight: '-0.01em',
    			normal: '0',
    			wide: '0.01em',
    			wider: '0.025em'
    		},
    		spacing: {
    			'1': '0.25rem',
    			'2': '0.5rem',
    			'3': '0.75rem',
    			'4': '1rem',
    			'5': '1.25rem',
    			'6': '1.5rem',
    			'8': '2rem',
    			'10': '2.5rem',
    			'12': '3rem',
    			'16': '4rem',
    			'20': '5rem',
    			'24': '6rem',
    			'32': '8rem',
    			'0.5': '0.125rem',
    			'1.5': '0.375rem',
    			'2.5': '0.625rem'
    		},
    		borderRadius: {
    			sm: 'calc(var(--radius) - 4px)',
    			DEFAULT: '0.5rem',
    			md: 'calc(var(--radius) - 2px)',
    			lg: 'var(--radius)',
    			xl: '1.5rem',
    			'2xl': '2rem'
    		},
    		maxWidth: {
    			content: '720px',
    			blog: '1100px',
    			wide: '1400px'
    		},
    		transitionDuration: {
    			fast: '150ms',
    			base: '250ms',
    			slow: '350ms',
    			smooth: '500ms'
    		},
    		transitionTimingFunction: {
    			smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			'fade-in': {
    				from: {
    					opacity: '0'
    				},
    				to: {
    					opacity: '1'
    				}
    			},
    			'slide-up': {
    				from: {
    					transform: 'translateY(10px)',
    					opacity: '0'
    				},
    				to: {
    					transform: 'translateY(0)',
    					opacity: '1'
    				}
    			},
    			shimmer: {
    				'0%': {
    					backgroundPosition: '-1000px 0'
    				},
    				'100%': {
    					backgroundPosition: '1000px 0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			'fade-in': 'fade-in 0.3s ease-out',
    			'slide-up': 'slide-up 0.4s ease-out',
    			shimmer: 'shimmer 2s infinite linear'
    		},
    		boxShadow: {
    			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    			elevated: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    		}
    	}
    },
    plugins: [
        tailwindAnimate,
        typography,
        require("tailwindcss-animate")
    ],
}

export default config
