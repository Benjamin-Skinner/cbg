import React from 'react'
import PlaceholderImage from './Placeholder'
import {
	HardcoverIcon,
	OpenInNewWindowIcon,
	RandRIcon,
	RectangleIcon,
	SquareIcon,
	UploadIcon,
} from '../Icons'
import { ImageOption } from '@/types'
import Image from 'next/image'
import mj_logo from '@/assets/midjourney.png'
import Link from 'next/link'
import { DEFAULT_AR } from '@/constants'
import { arToBoolean } from '@/util/aspectRatio'

interface Props {
	selected: boolean
	image: ImageOption
	deleteImage: (option: ImageOption) => Promise<void>
	selectImage: (imageOption: ImageOption) => void
}

const ImageCard: React.FC<Props> = ({
	image,
	selected,
	deleteImage,
	selectImage,
}) => {
	const { fullPage } = arToBoolean(image.ar)
	return (
		<div
			className={`card bg-base-100 shadow-xl w-full p-2 border-4 ${
				fullPage && 'col-span-2'
			} ${selected ? 'border-green-600' : 'border-transparent'}`}
		>
			<div className="flex flex-row space-x-4 pb-2">
				<ImageIcons image={image} />
			</div>

			<figure className="h-full">
				<Image
					src={image.url}
					alt="image option"
					width={400}
					height={fullPage ? 800 : 400}
					className={`rounded-lg w-full`}
				/>
			</figure>

			<div className="card-body py-4 justify-center">
				<div className="card-actions">
					<div className="items-center justify-evenly flex flex-row space-x-4 flex-1">
						<button
							className="btn btn-sm btn-outline btn-error"
							onClick={() => deleteImage(image)}
							// disabled={selected}
						>
							Remove
						</button>
						<button
							className="btn btn-sm btn-outline btn-success"
							disabled={false}
							onClick={() => selectImage(image)}
						>
							Select
						</button>
					</div>
					<Link
						target="_blank"
						href={`/image?url=${image?.url}`}
						className="btn btn-ghost btn-sm text-gray-500 ml-auto"
					>
						<OpenInNewWindowIcon size={4} />
					</Link>
				</div>
			</div>
		</div>
	)
}

export default ImageCard

/**
 * Lists icons to show the images properties:
 * 1. if the image was generated or uploaded manually
 * 2. the aspect ratio of the image
 */
interface ImageIconsProps {
	image: ImageOption
}

const ImageIcons: React.FC<ImageIconsProps> = ({ image }) => {
	const { square, fullPage, hardcover, rAndR } = arToBoolean(image.ar)

	return (
		<>
			<div className="border border-gray-400 w-8 aspect-square rounded-full flex items-center justify-center">
				{image.type === 'midjourney' ? (
					<Image
						src={mj_logo}
						className="rounded-full"
						alt="Midjourney logo"
						width={30}
						height={30}
					/>
				) : (
					<UploadIcon size={4} />
				)}
			</div>

			<div className="border border-gray-400 w-8 aspect-square rounded-full flex items-center justify-center">
				{fullPage && (
					<span title="Image is full page">
						<RectangleIcon size={4} />
					</span>
				)}

				{square && (
					<span title="Image is square">
						<SquareIcon size={4} />
					</span>
				)}

				{hardcover && (
					<span title="Image is hardcover size">
						<HardcoverIcon size={4} />
					</span>
				)}

				{rAndR && (
					<span title="Image is 4 to 1">
						<RandRIcon size={4} />
					</span>
				)}
			</div>
		</>
	)
}

interface Props {}
