import React from 'react'
import PlaceholderImage from './PlaceholderImage'
import PlaceholderBackcover from './PlaceholderBackcover'
import Image from 'next/image'

interface Props {
	backcover?: boolean
	image: string
	newImages: boolean
}

const ImageDisplay: React.FC<Props> = ({ backcover, image, newImages }) => {
	return (
		<div className="w-full h-full flex flex-col">
			{newImages && (
				<div className="w-full ">
					<p className="text-center text-white rounded-full py-3  h-25 bg-blue-600  m-auto">
						Click to view new images
					</p>
				</div>
			)}
			<figure className="w-full h-full m-auto flex items-center justify-center">
				{image === '' ? (
					<div className="h-full flex items-center justify-center w-full">
						<PlaceholderImage size={400} />
					</div>
				) : (
					<div>
						<Image
							src={image}
							alt="image"
							className="rounded-lg aspect-square object-cover"
							height={800}
							width={800}
						/>
					</div>
				)}
			</figure>

			{/* <div className="card-body py-4 justify-center">
				<div className="card-actions items-center justify-evenly flex flex-row space-x-4">
					<button className="btn btn-sm btn-outline btn-error">
						Remove
					</button>
					<button className="btn btn-sm btn-outline btn-success">
						Select
					</button>
				</div>
			</div> */}
		</div>
	)
}

export default ImageDisplay
