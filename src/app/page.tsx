import PllaceholderFullcover from '@/components/PlaceholderFullCover'
import TimeSince from '@/components/TimeAgo'
import { getAlllBooks } from '@/functions/getAllBooks'
import Link from 'next/link'

export default async function Home() {
	const books = await getAlllBooks()
	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-r from-blue-800 to-blue-300">
			{books.map((book) => (
				<div className="flex flex-col items-center justify-center bg-transparent">
					<Link
						className="card w-96 shadow-xl glass hover:scale-105 transition-all duration-200"
						href={`/book/${book.id}`}
					>
						<figure>
							<PllaceholderFullcover size={200} />
						</figure>
						<div className="card-body">
							<article className="prose">
								<h2 className="card-title">{book.title}</h2>
							</article>
							<p className="italic">
								Last updated <TimeSince time={book.lastSaved} />
							</p>
							{/* <div className="card-actions justify-end">
								<button className="btn btn-neutral">
									View Book
								</button>
							</div> */}
						</div>
					</Link>
				</div>
			))}
		</main>
	)
}
