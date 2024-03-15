import React from 'react'
import PlaceholderImage from './PlaceholderImage'
import PlaceholderBackcover from './PlaceholderBackcover'
import { OpenInNewWindowIcon } from './Icons'
import { ImageOption } from '@/types'
import Image from 'next/image'

interface Props {
	selected: boolean
	image?: ImageOption
	backcover?: boolean
	placeholder?: boolean
	deleteImage: (url: string) => void
	selectImage: (url: string) => void
}

const ImageCard: React.FC<Props> = ({
	image,
	selected,
	backcover,
	placeholder,
	deleteImage,
	selectImage,
}) => {
	return (
		<div
			className={`card bg-base-100 shadow-xl w-full p-2 border-4 ${
				selected ? 'border-green-600' : 'border-transparent'
			}`}
		>
			<figure className="">
				{backcover ? (
					<PlaceholderBackcover size={400} />
				) : placeholder ? (
					<PlaceholderImage size={400} />
				) : (
					<Image
						src={image?.url || '/placeholder.png'}
						alt="image option"
						width={400}
						height={400}
						className="rounded-lg aspect-squar"
					/>
				)}
			</figure>

			<div className="card-body py-4 justify-center">
				<div className="card-actions">
					<div className="items-center justify-evenly flex flex-row space-x-4 flex-1">
						<button
							className="btn btn-sm btn-outline btn-error"
							onClick={() => deleteImage(image?.url || '')}
							disabled={selected}
						>
							Remove
						</button>
						<button
							className="btn btn-sm btn-outline btn-success"
							onClick={() => selectImage(image?.url || '')}
						>
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
