'use client'

import React from 'react'
import { Book } from '@/types'
import Link from 'next/link'
import FullCoverImage from '@/components/fullCoverImage'
import TimeSince from '@/components/TimeAgo'
import Navbar from './Navbar'
import { SearchBar } from './Navbar'

interface Props {
	books: Book[]
}

const AllBooks: React.FC<Props> = ({ books }) => {
	const [currBooks, setCurrBooks] = React.useState<Book[]>(books)
	return (
		<div className="w-full">
			<Navbar />
			<SearchBar setCurrBooks={setCurrBooks} allBooks={books} />
			<div className="grid grid-cols-4 gap-x-8 gay-y-8 w-full pb-24">
				{currBooks.map((book) => (
					<BookComp key={book.id} book={book} />
				))}
			</div>
		</div>
	)
}

export default AllBooks

interface BookProps {
	book: Book
}

const BookComp: React.FC<BookProps> = ({ book }) => {
	const badgeFromStatus = (status: string) => {
		switch (status) {
			case 'inProgress':
				return (
					<div className="badge badge-info badge-lg mt-2">
						In Progress
					</div>
				)
			case 'uploaded':
				return (
					<div className="badge badge-success badge-lg mt-2">
						Uploaded
					</div>
				)
			case 'abandoned':
				return (
					<div className="badge badge-error badge-lg mt-2">
						Abandoned
					</div>
				)
			default:
				return (
					<div className="badge badge-info badge-lg mt-2">
						In Progress
					</div>
				)
		}
	}
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
					{badgeFromStatus(book.status)}
				</div>
			</Link>
		</div>
	)
}
