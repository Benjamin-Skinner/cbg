import React from 'react'
import PlaceholderImage from './PlaceholderImage'
import PlaceholderBackcover from './PlaceholderBackcover'
import Image from 'next/image'

interface Props {
	backcover?: boolean
	image: string
}

const ImageDisplay: React.FC<Props> = ({ backcover, image }) => {
	return (
		<div className="">
			<figure className="">
				{backcover ? (
					<PlaceholderBackcover size={400} />
				) : image === '' ? (
					<PlaceholderImage size={400} />
				) : (
					<div>
						<Image
							src={image}
							alt="image"
							className="rounded-lg aspect-square object-cover"
							height={400}
							width={400}
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
