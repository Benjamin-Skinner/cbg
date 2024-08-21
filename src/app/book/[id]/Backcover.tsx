'use client'
import React, { useState, useEffect, useRef } from 'react'
import Section from '@/components/Section'
import { Book, PageImage, ImagePrompt as ImagePromptT } from '@/types'
import SelectImage from '@/components/selectImage/SelectImage'
import ImagePrompt from '@/components/imagePrompt/ImagePrompt'
import GenerateImages from '@/components/generateImage/GenerateImage'
import ImageGenerationStatus from '@/components/generateImage/ImageGenerationStatus'
import { UpdateBookOptions } from './Client'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Backcover: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)

	const bookRef = useRef(book)

	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateImagePrompt = (
		prompt: ImagePromptT,
		options?: UpdateBookOptions
	) => {
		updateBook(
			{
				...bookRef.current,
				backCover: {
					...bookRef.current.backCover,
					image: {
						...bookRef.current.backCover.image,
						prompt,
					},
				},
			},
			options
		)
	}

	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook(
			{
				...bookRef.current,
				backCover: {
					...bookRef.current.backCover,
					image,
				},
			},
			options
		)
	}

	return (
		<Section title="Back Cover">
			<Section.Center>
				<SelectImage
					image={book.backCover.image}
					updateImage={updateImage}
					modalId="backCover"
					bookId={book.id}
					newImages={newImages}
					setNewImages={setNewImages}
					card
				/>
			</Section.Center>
			<Section.Right>
				<ImageGenerationStatus
					image={book.backCover.image}
					updateImage={updateImage}
				/>
				<ImagePrompt
					updatePrompt={updateImagePrompt}
					prompt={book.backCover.image.prompt}
					bookId={book.id}
					id="backCover"
				/>
				<GenerateImages
					setNewImages={setNewImages}
					image={book.backCover.image}
					updateImage={updateImage}
					id="backCover"
					bookId={book.id}
				/>
			</Section.Right>
		</Section>
	)
}

export default Backcover
