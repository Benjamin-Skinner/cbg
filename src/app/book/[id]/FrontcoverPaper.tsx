import React, { useState, useRef, useEffect } from 'react'
import { Book, PageImage } from '@/types'
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

	const bookRef = useRef(book)

	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook(
			{
				...bookRef.current,
				frontCover: {
					...bookRef.current.frontCover,
					paper: {
						...bookRef.current.frontCover.paper,
						image,
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
					disabled={
						book.frontCover.hard.image.status.generating
							.inProgress ||
						book.frontCover.hard.image.selected.url === ''
					}
				/>
			</Section.Right>
		</Section>
	)
}

export default FrontcoverPaper
