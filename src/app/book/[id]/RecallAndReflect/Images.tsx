import React from 'react'
import { Book } from '@/types'
import { ImagePrompt as ImagePromptT, PageImage } from '@/types'
import ImagePrompt from '@/components/imagePrompt/ImagePrompt'
import GenerateImages from '@/components/generateImage/GenerateImage'
import ImageGenerationStatus from '@/components/generateImage/ImageGenerationStatus'

interface Props {
	book: Book
	updateBook: (book: Book) => void
	setNewImages: (newImages: boolean) => void
}

const Images: React.FC<Props> = ({ book, updateBook, setNewImages }) => {
	const updateImagePrompt = (prompt: ImagePromptT) => {
		updateBook({
			...book,
			recallAndReflect: {
				...book.recallAndReflect,
				image: {
					...book.recallAndReflect.image,
					prompt,
				},
			},
		})
	}

	const updateImage = (image: PageImage) => {
		updateBook({
			...book,
			recallAndReflect: {
				...book.recallAndReflect,
				image,
			},
		})
	}

	return (
		<>
			<ImageGenerationStatus
				image={book.recallAndReflect.image}
				updateImage={updateImage}
			/>
			<ImagePrompt
				updatePrompt={updateImagePrompt}
				prompt={book.recallAndReflect.image.prompt}
				bookId={book.id}
				id="recallAndReflect"
			/>
			<GenerateImages
				setNewImages={setNewImages}
				image={book.recallAndReflect.image}
				updateImage={updateImage}
				id="recallAndReflect"
				bookId={book.id}
			/>
		</>
	)
}

export default Images
