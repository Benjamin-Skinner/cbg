'use client'

import React, { useState } from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'

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
			<input
				type="text"
				value={book.title}
				placeholder="Title"
				onChange={(e) => updateTitle(e.target.value)}
				className="w-full h-12 m-auto text-4xl font-bold text-center"
			/>
		</>
	)
}

export default Title
