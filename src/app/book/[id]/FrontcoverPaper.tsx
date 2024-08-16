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
					card
				/>
			</Section.Center>
			<Section.Right>
				<ImageGenerationStatus
					image={book.frontCover.paper.image}
					updateImage={updateImage}
				/>
				<div className="card bg-base-100 w-92 shadow-xl">
					<div className="card-body">
						{/* <h2 className="card-title">Card title!</h2> */}
						<p>
							The paper cover image will be generated from the
							selected hardcover image
						</p>
						<div className="card-actions justify-end"></div>
					</div>
				</div>

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
