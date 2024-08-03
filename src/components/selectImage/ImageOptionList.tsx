/**
 * Lists all of the image optons for the page and allows the user to select or delete.
 */

import { ImageOption, PageImage } from '@/types'
import React, { useState, useEffect } from 'react'
import ImageCard from './ImageCard'
import { image } from 'pdfkit'
import Placeholder from './Placeholder'

interface Props {
	image: PageImage
	updateImage: (image: PageImage) => void
	currImageOptions: ImageOption[]
	deleteImage: (option: ImageOption) => Promise<void>
	imageUploading: boolean
}

const ImageOptionList: React.FC<Props> = ({
	image: pageImage,
	updateImage,
	currImageOptions,
	deleteImage,
	imageUploading,
}) => {
	// Select an image: Just set the new image option using updateBook
	const selectImage = async (option: ImageOption) => {
		// Update book
		updateImage({
			...pageImage,
			image: option.url,
		})
	}

	return (
		<div className="grid grid-cols-3 pb-[700px] gap-y-14 pt-4 gap-x-8">
			{currImageOptions
				// Remove any images where there is something wrong with the URL
				.filter((image) => image.url !== '' && image.url !== null)
				.map((image, index) => (
					<ImageCard
						key={image.url}
						selected={
							pageImage.image === image.url && image.url !== ''
						}
						image={image}
						deleteImage={deleteImage}
						selectImage={selectImage}
					/>
				))}
			{imageUploading && <Placeholder ar={pageImage.ar} />}
		</div>
	)
}

export default ImageOptionList

// imageUploading ? (
// 	<ImageCard
// 		pageAr={DEFAULT_AR}
// 		selected={false}
// 		placeholder
// 		deleteImage={() => {}}
// 		selectImage={selectImage}
// 	/>
// ) : null
