'use client'
import React from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import ImagePicker from '@/components/ImagePicker'
import { Book } from '@/types'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}
const Backcover: React.FC<Props> = ({ book, updateBook }) => {
	const [prompt, setPrompt] = React.useState<string>(
		'Watercolor clip art of a tiger. Hyper realistic. Naturalistic.'
	)

	return (
		<Section title="Back Cover">
			<Section.Center>
				<div className="card w-1/2 bg-base-100 shadow-xl m-auto">
					<div className="card-body">
						{/* <ImagePicker
							backcover
							id="backcover"
							title="Back Cover"
						/> */}
					</div>
				</div>
			</Section.Center>
			<Section.Right>
				<Status status={book.backCover.status} />
				<textarea
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="textarea h-48 w-full mt-12 leading-5"
				/>

				<button disabled={true} className="btn btn-info btn-wide mt-12">
					Regenerate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Backcover
