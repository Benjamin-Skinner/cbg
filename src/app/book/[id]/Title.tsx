'use client'

import React, { useState } from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'
import BookStatus from './BookStatus'

interface Props {
	book: Book
	updateBook: (book: Book, options?: UpdateBookOptions) => void
}

const Title: React.FC<Props> = ({ book, updateBook }) => {
	const updateTitle = (title: string) => {
		updateBook({ ...book, title })
	}

	return (
		<>
			<div className="flex flex-col md:flex-row w-full m-auto">
				<input
					type="text"
					value={book.title}
					placeholder="Title"
					onChange={(e) => updateTitle(e.target.value)}
					className="w-full h-12 text-4xl font-bold text-center"
				/>
				<div className="absolute right-10 w-52">
					<BookStatus book={book} updateBook={updateBook} />
				</div>
			</div>
		</>
	)
}

export default Title
