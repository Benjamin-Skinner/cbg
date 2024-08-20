import React, { useEffect, useRef } from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'
import Section from '@/components/Section'
import Status from '@/components/Status'
import Stat from '@/components/Stat'
import { countWords } from '@/util/wordCount'
import StatusClass from '@/classes/Status'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const classes = {
	normal: 'w-full h-36 border-none resize-none focus:ring-0 focus:outline-none',
	generating: 'opacity-50',
}

const Blurb: React.FC<Props> = ({ book, updateBook }) => {
	const { generateBlurb } = useGenerateBlurb(updateBook, book)
	const { updateBlurb } = useUpdateBlurb(book, updateBook)

	const bookRef = useRef(book)

	useEffect(() => {
		bookRef.current = book
	}, [book])

	const cancelGeneration = () => {
		const newStatus = new StatusClass(book.blurb.status)
		newStatus.clearGenerating()
		updateBook({
			...bookRef.current,
			blurb: {
				...bookRef.current.blurb,
				status: newStatus.toObject(),
			},
		})
	}

	return (
		<Section title="Blurb">
			<Section.Center>
				<div className="h-[500px]">
					<div className="card shadow-xl bg-base-100 w-3/4 pt-8 space-y-8 m-auto">
						<article className="prose m-auto w-full h-full">
							<textarea
								disabled={
									book.blurb.status.generating.inProgress
								}
								placeholder="Blurb"
								value={book.blurb.text}
								onChange={(e) => updateBlurb(e.target.value)}
								className={`${classes.normal} ${
									book.blurb.status.generating.inProgress &&
									classes.generating
								}`}
							/>
						</article>
					</div>
				</div>
			</Section.Center>
			<Section.Right>
				<div className="flex flex-row mb-6">
					<Status status={book.blurb.status} />
					{book.blurb.status.generating.inProgress && (
						<button
							className="btn btn-sm btn-outline ml-6"
							onClick={cancelGeneration}
						>
							Cancel
						</button>
					)}
				</div>
				<Stat
					title="Word Count"
					value={countWords(book.blurb.text).toString()}
					desc={`Goal: 20-25 words`}
					error={
						countWords(book.blurb.text) < 20 ||
						countWords(book.blurb.text) > 25
					}
				/>
				<button
					className={`btn btn-info btn-wide mt-12`}
					onClick={generateBlurb}
					disabled={book.blurb.status.generating.inProgress}
				>
					Generate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Blurb

const useUpdateBlurb = (
	book: Book,
	updateBook: (book: Book, options?: UpdateBookOptions) => void
) => {
	const updateBlurb = (text: string) => {
		updateBook({
			...book,
			blurb: {
				...book.blurb,
				text,
			},
		})
	}

	return {
		updateBlurb,
	}
}

const useGenerateBlurb = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateBlurb = async () => {
		console.log('GENERATING BLURB')
		const newStatus = new StatusClass(book.blurb.status)
		newStatus.beginGenerating()

		updateBook(
			{
				...bookRef.current,
				blurb: {
					...bookRef.current.blurb,
					status: newStatus.toObject(),
				},
			},
			{
				clientOnly: true,
			}
		)
		const res = await fetch('/api/generate/blurb', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated blurb
		if (res.status === 200) {
			const { data } = await res.json()
			const newBook = {
				...bookRef.current,
				blurb: data,
			}
			handleGenerationSuccess(newBook, updateBook)
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)
			const newStatus = new StatusClass(bookRef.current.blurb.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook({
				...bookRef.current,
				blurb: {
					...bookRef.current.blurb,
					status: newStatus.toObject(),
				},
			})
		}
	}

	return {
		generateBlurb,
	}
}
