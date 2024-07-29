import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic':
					'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			aspectRatio: {
				hardcover: '16/22',
				softcover: '1/1',
				fullPage: '32/22',
				fullPageImage: '5/2',
			},
			fontFamily: {},
		},
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
export default config
