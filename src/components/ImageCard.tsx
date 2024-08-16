// import React from 'react'
// import PlaceholderImage from './PlaceholderImage'
// import PlaceholderBackcover from './PlaceholderBackcover'
// import { OpenInNewWindowIcon, RectangleIcon, SquareIcon } from './Icons'
// import { ImageAR, ImageOption } from '@/types'
// import Image from 'next/image'
// import mj_logo from '@/assets/midjourney.png'
// import { UploadIcon } from './Icons'
// import Link from 'next/link'
// import { DEFAULT_AR } from '@/constants'

// interface Props {
// 	selected: boolean
// 	image?: ImageOption
// 	placeholder?: boolean
// 	deleteImage: (url: string) => void
// 	selectImage: (imageOption: ImageOption) => void
// 	disabled?: boolean
// 	pageAr: ImageAR
// }

// const ImageCard: React.FC<Props> = ({
// 	image,
// 	selected,
// 	placeholder,
// 	deleteImage,
// 	selectImage,
// 	disabled = false,
// 	pageAr,
// }) => {
// 	const isFullPage = image && image.ar && image.ar.fullPage
// 	return (
// 		<div
// 			className={`card bg-base-100 shadow-xl w-full p-2 border-4 ${
// 				isFullPage && 'col-span-2'
// 			} ${selected ? 'border-green-600' : 'border-transparent'}`}
// 		>
// 			<div className="flex flex-row space-x-4 pb-2">
// 				<div className="border border-gray-400 w-8 aspect-square rounded-full flex items-center justify-center">
// 					{image?.type === 'midjourney' ? (
// 						<Image
// 							src={mj_logo}
// 							className="rounded-full"
// 							alt="Midjourney logo"
// 							width={30}
// 							height={30}
// 						/>
// 					) : (
// 						<UploadIcon size={4} />
// 					)}
// 				</div>
// 				<div className="border border-gray-400 w-8 aspect-square rounded-full flex items-center justify-center">
// 					{isFullPage ? (
// 						<span title="Image is full page">
// 							<RectangleIcon size={4} />
// 						</span>
// 					) : (
// 						<span title="Image is square">
// 							<SquareIcon size={4} />
// 						</span>
// 					)}
// 				</div>
// 			</div>

// 			<figure className="h-full">
// 				{placeholder ? (
// 					<PlaceholderImage size={400} />
// 				) : (
// 					<Image
// 						src={image?.url || '/placeholder.png'}
// 						alt="image option"
// 						width={400}
// 						height={isFullPage ? 800 : 400}
// 						className={`rounded-lg w-full`}
// 					/>
// 				)}
// 			</figure>

// 			<div className="card-body py-4 justify-center">
// 				<div className="card-actions">
// 					<p className="text-black">{JSON.stringify(image?.ar)}</p>
// 					<div className="items-center justify-evenly flex flex-row space-x-4 flex-1">
// 						<button
// 							className="btn btn-sm btn-outline btn-error"
// 							onClick={() => deleteImage(image?.url || '')}
// 							disabled={selected}
// 						>
// 							Remove
// 						</button>
// 						<button
// 							className="btn btn-sm btn-outline btn-success"
// 							disabled={false}
// 							onClick={() =>
// 								selectImage(
// 									image || {
// 										url: '',
// 										type: 'manual',
// 										error: 'No image selected',
// 										ar: DEFAULT_AR,
// 									}
// 								)
// 							}
// 						>
// 							Select
// 						</button>
// 					</div>
// 					<Link
// 						target="_blank"
// 						href={`/image?url=${image?.url}`}
// 						className="btn btn-ghost btn-sm text-gray-500 ml-auto"
// 					>
// 						<OpenInNewWindowIcon size={4} />
// 					</Link>
// 				</div>
// 				{/* <progress
// 					className={`${
// 						image?.progress === 100 || image?.progress === 0
// 							? 'hidden'
// 							: ''
// 					} progress progress-info w-56 m-auto mt-4`}
// 					value={image?.progress || 0}
// 					max="100"
// 				></progress> */}
// 			</div>
// 		</div>
// 	)
// }

// export default ImageCard
