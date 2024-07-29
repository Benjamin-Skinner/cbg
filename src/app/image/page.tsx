import React from 'react'
import Image from 'next/image'
import Head from 'next/head'

interface Props {
	searchParams: { url: string }
}

const ImagePage: React.FC<Props> = ({ searchParams }) => {
	return (
		<>
			<Head>
				<title>Image</title>
			</Head>
			<div className="w-screen h-screen py-12 px-12">
				<Image
					src={searchParams.url}
					alt="image"
					width={500}
					height={500}
					className="h-full w-auto mx-auto"
				/>
			</div>
		</>
	)
}

export default ImagePage
