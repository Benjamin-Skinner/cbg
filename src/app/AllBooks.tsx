'use client'

import React from 'react'
import { Book } from '@/types'
import Link from 'next/link'
import FullCoverImage from '@/components/fullCoverImage'
import TimeSince from '@/components/TimeAgo'
import Navbar from './Navbar'

interface Props {
	books: Book[]
}

const AllBooks: React.FC<Props> = ({ books }) => {
	return (
		<div>
			<Navbar />
			<div className="grid grid-cols-4 gap-x-8 gay-y-8">
				{books.map((book) => (
					<Book key={book.id} book={book} />
				))}
			</div>
		</div>
	)
}

export default AllBooks

interface BookProps {
	book: Book
}

const Book: React.FC<BookProps> = ({ book }) => {
	return (
		<div className="flex flex-col items-center justify-center mt-8">
			<Link
				className="card w-96 shadow-xl hover:scale-105 transition-all transition-200 active:scale-100"
				href={`/book/${book.id}`}
			>
				<figure>
					{<FullCoverImage image={book.frontCover.image.image} />}
				</figure>
				<div className="card-body bg-white rounded-md">
					<article className="prose">
						<h2 className="card-title">{book.title}</h2>
					</article>
					<p className="italic">
						Last updated <TimeSince time={book.lastSaved} />
					</p>
				</div>
			</Link>
		</div>
	)
}
