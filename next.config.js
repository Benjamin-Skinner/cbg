/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
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
			{
				protocol: 'https',
				hostname: 'v0qjrdg3gu2tx1zw.public.blob.vercel-storage.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'cbgstorage.s3.eu-north-1.amazonaws.com',
				port: '',
				pathname: '/**',
			},
		],
	},
}

module.exports = nextConfig
