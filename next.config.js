/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['cdn.midjourney.com', 'cdn.discordapp.com'],
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.discordapp.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.midjourney.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
