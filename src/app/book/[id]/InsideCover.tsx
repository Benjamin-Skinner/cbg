import React, { useState, useEffect, useRef } from 'react'
import { Book, PageImage, ImagePrompt as ImagePromptT } from '@/types'
import Section from '@/components/Section'
import SelectImage from '@/components/selectImage/SelectImage'
import { UpdateBookOptions } from './Client'
import ImagePrompt from '@/components/imagePrompt/ImagePrompt'
import GenerateImages from '@/components/generateImage/GenerateImage'
import ImageGenerationStatus from '@/components/generateImage/ImageGenerationStatus'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const InsideCover: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)

	const bookRef = useRef(book)

	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook(
			{
				...bookRef.current,
				insideCover: {
					...bookRef.current.insideCover,
					image,
				},
			},
			options
		)
	}

	const updateImagePrompt = (
		prompt: ImagePromptT,
		options?: UpdateBookOptions
	) => {
		updateBook(
			{
				...bookRef.current,
				insideCover: {
					...bookRef.current.insideCover,
					image: {
						...bookRef.current.insideCover.image,
						prompt,
					},
				},
			},
			options
		)
	}

	return (
		<Section title="Inside Cover">
			<Section.Center>
				<SelectImage
					image={book.insideCover.image}
					updateImage={updateImage}
					modalId="insideCover"
					bookId={book.id}
					newImages={newImages}
					setNewImages={setNewImages}
					card
				/>
			</Section.Center>
			<Section.Right>
				<ImageGenerationStatus
					image={book.insideCover.image}
					updateImage={updateImage}
				/>
				<ImagePrompt
					updatePrompt={updateImagePrompt}
					prompt={book.insideCover.image.prompt}
					bookId={book.id}
					id="insideCover"
				/>
				<GenerateImages
					setNewImages={setNewImages}
					image={book.insideCover.image}
					updateImage={updateImage}
					id="insideCover"
					bookId={book.id}
				/>
			</Section.Right>
		</Section>
	)
}

export default InsideCover
