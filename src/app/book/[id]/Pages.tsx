'use client'

import React, { useCallback, useEffect } from 'react'
import Chapter from './Chapter'
import { Book, Page } from '@/types'
import { UpdateBookOptions } from './Client'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Pages: React.FC<Props> = ({ book, updateBook }) => {
	useEffect(() => {
		console.log('Book updated in Pages Component')
		console.log(book)
	}, [book])
	const [style, setStyle] = React.useState<'hardcover' | 'softcover'>(
		'hardcover'
	)

	// The updatePage function prop is not updating when book updates
	const updateIntro = useCallback(
		(page: Page, options?: UpdateBookOptions) => {
			updateBook(
				{
					...book,
					pages: {
						...book.pages,
						intro: page,
					},
				},
				options
			)
		},
		[book, updateBook, book.pages]
	)

	const updateConclusion = useCallback(
		(page: Page, options?: UpdateBookOptions) => {
			updateBook(
				{
					...book,
					pages: {
						...book.pages,
						conclusion: page,
					},
				},
				options
			)
		},
		[book]
	)

	const updateChapter = useCallback(
		(index: number, page: Page, options?: UpdateBookOptions): void => {
			console.log('Updating chapter with book value of:')
			console.log(book.pages.chapters)
			updateBook(
				{
					...book,
					pages: {
						...book.pages,
						chapters: [
							...book.pages.chapters.slice(0, index),
							page,
							...book.pages.chapters.slice(index + 1),
						],
					},
				},
				options
			)
		},
		[book, updateBook, book.pages]
	)
	return (
		<>
			<Chapter
				intro
				book={book}
				title="Introduction"
				style={style}
				page={book.pages.intro}
				updatePage={updateIntro}
			/>
			{book.pages.chapters.map((page, index) => (
				<Chapter
					book={book}
					title={`${page.currPosition}. ${page.title}`}
					style={style}
					page={page}
					updatePage={(page, options) =>
						updateChapter(index, page, options)
					}
				/>
			))}

			<Chapter
				conclusion
				book={book}
				title="Conclusion"
				style={style}
				page={book.pages.conclusion}
				updatePage={updateConclusion}
			/>
		</>
	)
}

export default Pages
