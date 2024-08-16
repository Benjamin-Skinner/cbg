// import React, { useState } from 'react'
// import PlaceholderImage from './PlaceholderImage'
// import PlaceholderBackcover from './PlaceholderBackcover'
// import Image from 'next/image'
// import { ImageAR } from '@/types'
// import NewImagesBanner from './NewImagesBanner'

// interface Props {
// 	backcover?: boolean
// 	image: string
// 	newImages: boolean
// 	transparent?: boolean
// 	imgHeight?: number
// 	imgWidth?: number
// 	ar?: ImageAR
// }

// const ImageDisplay: React.FC<Props> = ({
// 	backcover,
// 	image,
// 	newImages,
// 	transparent,
// 	imgHeight,
// 	imgWidth,
// 	ar,
// }) => {
// 	const isFullPage = ar && ar.fullPage
// 	const [hasError, setHasError] = useState(false)

// 	const handleImageError = () => {
// 		setHasError(true)
// 	}

// 	return (
// 		<div className="w-full h-full flex flex-col">
// 			{newImages && (
// 				<div className="w-full ">
// 					<NewImagesBanner />
// 				</div>
// 			)}
// 			<figure className="w-full h-full m-auto flex items-center justify-center">
// 				{image === '' || !image || hasError ? (
// 					<div className="h-full flex items-center justify-center w-full">
// 						<PlaceholderImage
// 							size={400}
// 							ar={
// 								ar?.fullPage
// 									? 'fullPage'
// 									: ar?.height === ar?.width
// 									? 'square'
// 									: 'hardcover'
// 							}
// 						/>
// 					</div>
// 				) : (
// 					<div>
// 						<Image
// 							src={image}
// 							alt="image"
// 							className={`rounded-lg object-cover ${
// 								transparent && 'opacity-20'
// 							} ${isFullPage && ''}`}
// 							height={imgHeight || 800}
// 							width={imgWidth || 800}
// 							onError={handleImageError}
// 						/>
// 					</div>
// 				)}
// 			</figure>
// 		</div>
// 	)
// }

// export default ImageDisplay
