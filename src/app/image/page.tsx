import React from 'react'
import Image from 'next/image'
import Head from 'next/head'

interface Props {
	searchParams: {
		url: string
		messageId: string
		aspectRatio: string
		type: string
	}
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

			<div className="card bg-base-100 shadow-xl w-fit m-auto">
				<div className="card-body">
					<p className="card-title">Image Info</p>
					<div className="">
						<p className="italic">message ID</p>

						<p className="">{searchParams.messageId}</p>
					</div>
					<div className="">
						<p className="italic">URL</p>

						<p className="">{searchParams.url}</p>
					</div>
					<div className="">
						<p className="italic">Aspect Ratio</p>

						<p className="">{searchParams.aspectRatio}</p>
					</div>
					<div className="">
						<p className="italic">Source</p>

						<p className="">{searchParams.type}</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default ImagePage
