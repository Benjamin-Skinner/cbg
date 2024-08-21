import React from 'react'
import PlaceholderImage from './Placeholder'
import {
	HardcoverIcon,
	OpenInNewWindowIcon,
	RandRIcon,
	RectangleIcon,
	SquareIcon,
	UploadIcon,
	NumberIcon,
} from '../Icons'
import { ImageOption } from '@/types'
import Image from 'next/image'
import mj_logo from '@/assets/midjourney.png'
import Link from 'next/link'
import { DEFAULT_AR } from '@/constants'
import { arToBoolean } from '@/util/aspectRatio'
import { BiInfoCircle } from 'react-icons/bi'

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
	const { fullPage, rAndR } = arToBoolean(image.ar)
	return (
		<div
			className={`card bg-base-100 shadow-xl w-full p-2 border-4 ${
				fullPage || (rAndR && 'col-span-2')
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
						<div className="flex items-center justify-end w-full">
							<Link
								target="_blank"
								href={`/image?url=${image?.url}&messageId=${image?.messageId}&aspectRatio=${image?.ar?.width}:${image?.ar?.height}&type=${image?.type}`}
								className="btn btn-ghost btn-sm text-gray-500"
							>
								<OpenInNewWindowIcon size={4} />
							</Link>
						</div>
					</div>
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
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image was generated using Midjourney"
					>
						<Image
							src={mj_logo}
							className="rounded-full"
							alt="Midjourney logo"
							width={30}
							height={30}
						/>
					</div>
				) : (
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image was manually uploaded"
					>
						<UploadIcon size={4} />
					</div>
				)}
			</div>

			<div className="border border-gray-400 w-8 aspect-square rounded-full flex items-center justify-center">
				{fullPage && (
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image is full-page"
					>
						<RectangleIcon size={4} />
					</div>
				)}

				{square && (
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image is square"
					>
						<SquareIcon size={4} />
					</div>
				)}

				{hardcover && (
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image is hardcover size"
					>
						<HardcoverIcon size={4} />
					</div>
				)}

				{rAndR && (
					<div
						className="tooltip tooltip-bottom"
						data-tip="Image has an aspect ratio of 4:1"
					>
						<RandRIcon size={4} />
					</div>
				)}
			</div>
		</>
	)
}

interface Props {}
