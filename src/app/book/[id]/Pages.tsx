'use client'

import React from 'react'
import Chapter from './Chapter'
import { Book, Page } from '@/types'
import { UpdateBookOptions } from './Client'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Pages: React.FC<Props> = ({ book, updateBook }) => {
	const [style, setStyle] = React.useState<'hardcover' | 'softcover'>(
		'hardcover'
	)

	return (
		<>
			<Chapter
				intro
				book={book}
				title="Introduction"
				style={style}
				page={book.pages.intro}
				updatePage={(page, options) => {
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
				}}
			/>
			{book.pages.chapters.map((page, index) => (
				<Chapter
					book={book}
					title={`Page ${page.currPosition}: ${page.title}`}
					style={style}
					page={page}
					updatePage={(
						page: Page,
						options?: UpdateBookOptions
					): void => {
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
					}}
				/>
			))}
			<Chapter
				conclusion
				book={book}
				title="Conclusion"
				style={style}
				page={book.pages.conclusion}
				updatePage={(page, options) => {
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
				}}
			/>
		</>
	)
}

export default Pages
