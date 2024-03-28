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

	async function updateImages() {
		console.log('Updating images')
		const res = await fetch('/api/generate/image', {
			method: 'PUT',
			body: JSON.stringify({
				book: book,
			}),
		})

		const newBook = (await res.json()).data
		console.log(newBook)
		updateBook(newBook, {
			clientOnly: true,
		})
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
			<button
				className="bg-red-400 rounded-md p-4"
				onClick={updateImages}
			>
				Update Images
			</button>
		</>
	)
}

export default Title
