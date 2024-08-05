import React, { useState } from 'react'
import { Book, ImagePrompt as ImagePromptT, PageImage } from '@/types'
import Section from '@/components/Section'
import SelectImage from '@/components/selectImage/SelectImage'
import { UpdateBookOptions } from './Client'
import ImagePrompt from '@/components/imagePrompt/ImagePrompt'
import ImageGenerationStatus from '@/components/generateImage/ImageGenerationStatus'
import GenerateImages from '@/components/generateImage/GenerateImage'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const FrontcoverPaper: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)
	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook(
			{
				...book,
				frontCover: {
					...book.frontCover,
					paper: {
						...book.frontCover.paper,
						image,
					},
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
				...book,
				frontCover: {
					...book.frontCover,
					paper: {
						...book.frontCover.paper,
						image: {
							...book.frontCover.paper.image,
							prompt,
						},
					},
				},
			},
			options
		)
	}

	return (
		<Section title="Paperback Front Cover">
			<Section.Center>
				<SelectImage
					image={book.frontCover.paper.image}
					updateImage={updateImage}
					modalId="frontCover-paper"
					bookId={book.id}
					newImages={newImages}
					setNewImages={setNewImages}
				/>
			</Section.Center>
			<Section.Right>
				<ImageGenerationStatus image={book.frontCover.paper.image} />
				<ImagePrompt
					updatePrompt={updateImagePrompt}
					prompt={book.frontCover.paper.image.prompt}
					bookId={book.id}
					id="frontCover-paper"
				/>
				<GenerateImages
					setNewImages={setNewImages}
					image={book.frontCover.paper.image}
					updateImage={updateImage}
					id="frontCover-paper"
					bookId={book.id}
				/>
			</Section.Right>
		</Section>
	)
}

export default FrontcoverPaper
