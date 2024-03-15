'use client'

import React, { useState, useEffect, useRef } from 'react'
import Section from '@/components/Section'
import Status from '@/components/Status'
import { Reorder } from 'framer-motion'
import { Lock, LockOpenIcon } from '@/components/Icons'
import { Book, BookPages, OutlinePage, Page } from '@/types'
import StatusClass from '@/classes/Status'
import { UpdateBookOptions } from './Client'
import { handleErrorOnClient } from '@/util/handleErrorOnClient'
import { handleGenerationSuccess } from '@/util/handleGenerationSuccess'

interface Props {
	book: Book
	updateBook: (book: Book) => void
}

const Outline: React.FC<Props> = ({ book, updateBook }) => {
	const [labels, setLabels] = useState<Page[]>([
		...book.pages.chapters.sort((a, b) => a.currPosition - b.currPosition),
	])

	useEffect(() => {
		setLabels([
			...book.pages.chapters.sort(
				(a, b) => a.currPosition - b.currPosition
			),
		])
	}, [book.pages])

	const updateOutline = (newPages: Page[]) => {
		if (book.outline.status.generating.inProgress) return

		updateBook({
			...book,
			pages: { ...book.pages, chapters: newPages },
		})
	}

	/**
	 * @feature Request a regeneration of the outline
	 */
	const { generateOutline } = useGenerateOutline(updateBook, book)

	return (
		<Section title="Outline">
			<Section.Center>
				<div className="w-fit m-auto">
					<PageCardLocked page="Introduction" />
					<Reorder.Group
						axis="y"
						values={labels}
						onReorder={updateOutline}
					>
						{labels.map((page, index) => (
							<Reorder.Item key={page.key} value={page}>
								<PageCard
									page={page}
									index={index}
									pages={labels}
									setPages={updateOutline}
									key={page.key}
									book={book}
									updateBook={updateBook}
								/>
							</Reorder.Item>
						))}
					</Reorder.Group>
					<PageCardLocked page="Conclusion" />
				</div>
			</Section.Center>
			<Section.Right>
				<Status status={book.outline.status} />

				<button
					disabled={book.outline.status.generating.inProgress}
					onClick={generateOutline}
					className="btn btn-info btn-wide mt-12"
				>
					Regenerate
				</button>
			</Section.Right>
		</Section>
	)
}

export default Outline

interface PageCardProps {
	page: Page
	index: number
	pages: Page[]
	setPages: (pages: Page[]) => void
	book: Book
	updateBook: (book: Book) => void
}

const PageCard: React.FC<PageCardProps> = ({
	page,
	index,
	pages,
	setPages,
	book,
	updateBook,
}) => {
	const lock = () => {
		const newPages = book.pages.chapters.map((p) => {
			if (p.key === page.key) {
				return {
					...p,
					subjectLocked: !p.subjectLocked || false,
				}
			}
			return p
		})
		updateBook({
			...book,
			pages: {
				...book.pages,
				chapters: newPages,
			},
		})
	}

	return (
		<div className=" flex flex-row items-center">
			<div className="card w-96 bg-base-100 shadow-xl my-2 cursor-row-resize flex flex-row items-center">
				<div className="card-body py-4">
					<article className="prose">
						<input
							// disabled={true}
							type="text"
							value={page.title}
							placeholder="(Page name)"
							className="font-bold w-full"
							onChange={(e) => {
								const newPages = [...pages]
								newPages[index].title = e.target.value
								setPages(newPages)
							}}
						/>
					</article>
				</div>
				{page.subjectLocked ? (
					<>
						<button
							disabled={book.outline.status.generating.inProgress}
							onClick={lock}
							className={`btn btn-ghost ${
								book.outline.status.generating.inProgress
									? 'opacity-20'
									: ''
							}`}
						>
							<Lock />
						</button>
					</>
				) : (
					<>
						<button
							disabled={book.outline.status.generating.inProgress}
							onClick={lock}
							className="btn btn-ghost opacity-20"
						>
							<LockOpenIcon />
						</button>
					</>
				)}
			</div>
		</div>
	)
}

interface PageCardLockedProps {
	page: string
}

const PageCardLocked: React.FC<PageCardLockedProps> = ({ page }) => {
	return (
		<div className="card w-96 bg-base-100 shadow-xl my-2">
			<div className="card-body py-4">
				<article className="prose">
					<input
						disabled={true}
						type="text"
						value={page}
						className="font-bold w-full"
					/>
				</article>
			</div>
		</div>
	)
}

const useGenerateOutline = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	// Use a ref to store the current book
	const bookRef = useRef(book)

	// Update the ref whenever the book changes
	useEffect(() => {
		bookRef.current = book
	}, [book])

	async function generateOutline() {
		const newStatus = new StatusClass(book.outline.status)
		newStatus.beginGenerating()

		await updateBook(
			{
				...bookRef.current,
				outline: {
					...bookRef.current.outline,
					status: newStatus.toObject(),
				},
			},
			{
				clientOnly: true,
			}
		)
		const res = await fetch('/api/generate/outline', {
			method: 'POST',
			body: JSON.stringify({
				book: book,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		})

		// SUCCESS --> update the state with the new generated outline
		if (res.status === 200) {
			const { outline, pages } = await res.json()

			const newBook = {
				...bookRef.current,
				outline: outline,
				pages: pages,
			}
			handleGenerationSuccess(newBook, updateBook)
		} else {
			const { error, code } = await res.json()
			console.error(`${code}: ${error}`)
			const newStatus = new StatusClass(bookRef.current.outline.status)
			newStatus.setError(error)
			newStatus.clearGenerating()
			updateBook({
				...book,
				outline: {
					...book.outline,
					status: newStatus.toObject(),
				},
			})
		}
	}

	return {
		generateOutline,
	}
}
