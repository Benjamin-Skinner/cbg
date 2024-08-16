import React, { useRef, useEffect, useState } from 'react'
import { Page, Book, PageImage, ImagePrompt as ImagePromptT } from '@/types'
import { UpdateBookOptions } from '../../Client'
import ImagePrompt from '@/components/imagePrompt/ImagePrompt'
import ImageGenerationStatus from '@/components/generateImage/ImageGenerationStatus'
import GenerateImages from '@/components/generateImage/GenerateImage'

interface ImageProps {
	page: Page
	updatePage: (page: Page, options?: UpdateBookOptions) => void
	book: Book
	newImages: boolean
	setNewImages: (newImages: boolean) => void
}

const Images: React.FC<ImageProps> = ({
	page,
	updatePage,
	book,
	setNewImages,
}) => {
	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updatePage(
			{
				...page,
				image: {
					...page.image,
					...image,
				},
			},
			options
		)
	}

	const updateImagePrompt = (prompt: ImagePromptT) => {
		updatePage({
			...page,
			image: {
				...page.image,
				prompt: prompt,
			},
		})
	}

	return (
		<>
			<ImageGenerationStatus
				image={page.image}
				updateImage={updateImage}
			/>

			<ImagePrompt
				updatePrompt={updateImagePrompt}
				prompt={page.image.prompt}
				bookId={book.id}
				id="page"
				pageKey={page.key}
			/>

			<GenerateImages
				setNewImages={setNewImages}
				image={page.image}
				updateImage={updateImage}
				id="page"
				bookId={book.id}
				pageKey={page.key}
			/>
		</>
	)
}

export default Images
