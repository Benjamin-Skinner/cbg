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

const FrontcoverHard: React.FC<Props> = ({ book, updateBook }) => {
	const [newImages, setNewImages] = useState(false)
	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook(
			{
				...book,
				frontCover: {
					...book.frontCover,
					hard: {
						...book.frontCover.hard,
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
					hard: {
						...book.frontCover.hard,
						image: {
							...book.frontCover.hard.image,
							prompt,
						},
					},
				},
			},
			options
		)
	}

	return (
		<Section title="Hardback Front Cover">
			<Section.Center>
				<SelectImage
					image={book.frontCover.hard.image}
					updateImage={updateImage}
					modalId="frontCover-hard"
					bookId={book.id}
					newImages={newImages}
					setNewImages={setNewImages}
					card
				/>
			</Section.Center>
			<Section.Right>
				<ImageGenerationStatus
					image={book.frontCover.hard.image}
					updateImage={updateImage}
				/>
				<ImagePrompt
					updatePrompt={updateImagePrompt}
					prompt={book.frontCover.hard.image.prompt}
					bookId={book.id}
					id="frontCover-hard"
				/>
				<GenerateImages
					setNewImages={setNewImages}
					image={book.frontCover.hard.image}
					updateImage={updateImage}
					id="frontCover-hard"
					bookId={book.id}
				/>
			</Section.Right>
		</Section>
	)
}

export default FrontcoverHard
