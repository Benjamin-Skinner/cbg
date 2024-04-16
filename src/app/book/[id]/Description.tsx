'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Book } from '@/types'
import Stat from '@/components/Stat'
import Status from '@/components/Status'
import Section from '@/components/Section'
import { countWords } from '@/util/wordCount'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from './Client'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Description: React.FC<Props> = ({ book, updateBook }) => {
	const [isHardcover, setIsHardcover] = useState<boolean>(false)

	/**
	 * @feature Manually update the text of the description
	 */
	const { updateFirst, updateSecond, updateThird } = useUpdatePages(
		isHardcover,
		book,
		updateBook
	)

	/**
	 * @feature Request a regeneration of the description
	 */
	const { generateDescription } = useGenerateDescription(
		updateBook,
		isHardcover,
		book
	)

	const classes = {
		normal: 'w-full h-36 border-none resize-none focus:ring-0 focus:outline-none',
		generating: 'opacity-50',
	}

	return (
		<Section title="Description">
			<Section.Center>
				<div className="h-[500px]">
					<div className="card shadow-xl bg-base-100 w-3/4 pt-8 space-y-8 m-auto">
						<article className="prose m-auto w-full h-full">
							<textarea
								disabled={
									book.description.status.generating
										.inProgress
								}
								placeholder="First Paragraph"
								value={
									isHardcover
										? book.description.hardcover.first
										: book.description.softcover.first
								}
								onChange={(e) => updateFirst(e.target.value)}
								className={`${classes.normal} ${
									book.description.status.generating
										.inProgress && classes.generating
								}`}
							/>
							<textarea
								disabled={
									book.description.status.generating
										.inProgress
								}
								placeholder="Second Paragraph"
								value={
									isHardcover
										? book.description.hardcover.second
										: book.description.softcover.second
								}
								onChange={(e) => updateSecond(e.target.value)}
								className={`${classes.normal} ${
									book.description.status.generating
										.inProgress && classes.generating
								}`}
							/>
							{isHardcover && (
								<textarea
									disabled={
										book.description.status.generating
											.inProgress
									}
									placeholder="Third Paragraph"
									value={book.description.hardcover.third}
									onChange={(e) =>
										updateThird(e.target.value)
									}
									className={`${classes.normal} ${
										book.description.status.generating
											.inProgress && classes.generating
									}`}
								/>
							)}
						</article>
					</div>
				</div>
			</Section.Center>
			<Section.Right sectionName="description">
				<Status
					status={book.description.status}
					section="description"
				/>
				<div role="tablist" className="tabs tabs-boxed mt-6 mb-4">
					<button
						onClick={() => setIsHardcover(false)}
						role="tab"
						className={`tab ${
							!isHardcover && 'tab-active'
						} transition-all duration-250 `}
					>
						Softcover
					</button>
					<button
						onClick={() => setIsHardcover(true)}
						role="tab"
						className={`tab ${
							isHardcover && 'tab-active'
						} transition-all duration-250`}
					>
						Hardcover
					</button>
				</div>

				<Stat
					title="Word Count"
					value={getWordCount(isHardcover, book)}
					desc={`Goal ${
						isHardcover ? '140 — 160' : '95 — 105'
					} words`}
				/>
				<button
					className={`btn btn-info btn-wide mt-12`}
					onClick={generateDescription}
					disabled={book.description.status.generating.inProgress}
				>
					Generate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Description

function getWordCount(isHardcover: boolean, book: Book) {
	return isHardcover
		? (
				countWords(book.description.hardcover.first) +
				countWords(book.description.hardcover.second) +
				countWords(book.description.hardcover.third)
		  ).toString()
		: (
				countWords(book.description.softcover.first) +
				countWords(book.description.softcover.second)
		  ).toString()
}

const useUpdatePages = (
	isHardcover: boolean,
	book: Book,
	updateBook: (book: Book, options?: UpdateBookOptions) => void
) => {
	const updateFirst = (description: string) => {
		if (isHardcover) {
			updateBook({
				...book,
				description: {
					...book.description,
					hardcover: {
						...book.description.hardcover,
						first: description,
					},
				},
			})
		} else {
			updateBook({
				...book,
				description: {
					...book.description,
					softcover: {
						...book.description.softcover,
						first: description,
					},
				},
			})
		}
	}

	const updateSecond = (description: string) => {
		if (isHardcover) {
			updateBook({
				...book,
				description: {
					...book.description,
					hardcover: {
						...book.description.hardcover,
						second: description,
					},
				},
			})
		} else {
			updateBook({
				...book,
				description: {
					...book.description,
					softcover: {
						...book.description.softcover,
						second: description,
					},
				},
			})
		}
	}

	const updateThird = (description: string) => {
		if (isHardcover) {
			updateBook({
				...book,
				description: {
					...book.description,
					hardcover: {
						...book.description.hardcover,
						third: description,
					},
				},
			})
		}
	}

	return {
		updateFirst,
		updateSecond,
		updateThird,
	}
}

const useGenerateDescription = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	isHardcover: boolean,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	const generateDescription = async () => {
		console.log('GENERATING DESCRIPTION')
		const newStatus = new StatusClass(book.description.status)
		newStatus.beginGenerating()

		await updateBook({
			...bookRef.current,
			description: {
				...bookRef.current.description,
				status: newStatus.toObject(),
			},
		})
		const res = await fetch('/api/generate/description', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
				type: isHardcover ? 'hardcover' : 'softcover',
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated description
		if (res.status === 200) {
			const { data } = await res.json()
			const newBook = {
				...bookRef.current,
				description: data,
			}
			handleGenerationSuccess(newBook, updateBook)
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)
			const newStatus = new StatusClass(
				bookRef.current.description.status
			)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook({
				...book,
				description: {
					...book.description,
					status: newStatus.toObject(),
				},
			})
		}
	}

	return {
		generateDescription,
	}
}
