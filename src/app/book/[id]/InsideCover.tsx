import React from 'react'
import { Book, PageImage } from '@/types'
import Section from '@/components/Section'
import SelectImage from '@/components/selectImage/SelectImage'
import { UpdateBookOptions } from './Client'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const InsideCover: React.FC<Props> = ({ book, updateBook }) => {
	const updateImage = (image: PageImage, options?: UpdateBookOptions) => {
		updateBook({
			...book,
			insideCover: {
				...book.insideCover,
				image,
			},
		})
	}

	return (
		<Section title="Inside Cover">
			<Section.Center>
				<SelectImage
					image={book.insideCover.image}
					updateImage={updateImage}
					modalId="insideCover"
					bookId={book.id}
				/>
			</Section.Center>
			<Section.Right></Section.Right>
		</Section>
	)
}

export default InsideCover
