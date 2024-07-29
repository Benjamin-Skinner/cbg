'use client'

import React, { useCallback, useEffect, useRef } from 'react'
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

	const { updateChapter, updateConclusion, updateIntro } = useUpdatePage(
		updateBook,
		book
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
					title={`${index + 1}. ${page.title}`}
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

const useUpdatePage = (
	updateBook: (book: Book, options?: UpdateBookOptions) => void,
	book: Book
) => {
	const bookRef = useRef(book)

	useEffect(() => {
		bookRef.current = book
	}, [book])

	const updateChapter = (
		index: number,
		page: Page,
		options?: UpdateBookOptions
	) => {
		updateBook(
			{
				...bookRef.current,
				pages: {
					...bookRef.current.pages,
					chapters: [
						...bookRef.current.pages.chapters.slice(0, index),
						page,
						...bookRef.current.pages.chapters.slice(index + 1),
					],
				},
			},
			options
		)
	}

	const updateConclusion = (page: Page, options?: UpdateBookOptions) => {
		updateBook(
			{
				...bookRef.current,
				pages: {
					...bookRef.current.pages,
					conclusion: page,
				},
			},
			options
		)
	}

	const updateIntro = (page: Page, options?: UpdateBookOptions) => {
		updateBook(
			{
				...bookRef.current,
				pages: {
					...bookRef.current.pages,
					intro: page,
				},
			},
			options
		)
	}

	return {
		updateChapter,
		updateConclusion,
		updateIntro,
	}
}
