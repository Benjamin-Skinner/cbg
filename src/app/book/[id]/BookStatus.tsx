import React from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'

interface Props {
	book: Book
	updateBook: (book: Book, funcOptions?: UpdateBookOptions) => void
}

const BookStatus: React.FC<Props> = ({ book, updateBook }) => {
	const getClasses = (status: string, color: string) => {
		return `rounded-md border-${color} border-2 text-${color}-500 bg-${color}-100 hover:bg-${color}-200`
	}

	console.log('BOOK STATUS', book.status)

	return (
		<div className="w-full">
			<select
				id="status"
				className="select select-bordered w-full"
				onChange={(e) => {
					updateBook(
						{
							...book,
							status: e.target.value as
								| 'inProgress'
								| 'uploaded'
								| 'abandoned',
						},
						{ clientOnly: false }
					)
				}}
				value={book.status}
			>
				<option value="inProgress">In Progress</option>
				<option value="uploaded">Uploaded</option>
				<option value="abandoned">Abandoned</option>
			</select>
		</div>
	)
}

export default BookStatus