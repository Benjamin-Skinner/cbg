import React from 'react'
import PlaceholderImage from './PlaceholderImage'
import PlaceholderBackcover from './PlaceholderBackcover'
import { OpenInNewWindowIcon } from './Icons'

interface Props {
	backcover?: boolean
}

const ImageCard: React.FC<Props> = ({ backcover }) => {
	return (
		<div className="card bg-base-100 shadow-xl w-full p-2">
			<figure className="">
				{backcover ? (
					<PlaceholderBackcover size={400} />
				) : (
					<PlaceholderImage size={400} />
				)}
			</figure>

			<div className="card-body py-4 justify-center">
				<div className="card-actions">
					<div className="items-center justify-evenly flex flex-row space-x-4 flex-1">
						<button className="btn btn-sm btn-outline btn-error">
							Remove
						</button>
						<button className="btn btn-sm btn-outline btn-success">
							Select
						</button>
					</div>
					<button className="btn btn-ghost btn-sm text-gray-500 ml-auto">
						<OpenInNewWindowIcon size={4} />
					</button>
				</div>
			</div>
		</div>
	)
}

export default ImageCard
