import { Book } from '@/types'
import clientPromise from '@/util/db'
import { EXCLUDE } from '@/constants'

export async function getAllBooks() {
	const client = await clientPromise
	const db = client.db()
	const bookDocs = await db.collection('books').find({})

	const books = []

	for await (const bookDoc of bookDocs) {
		const book: Book = {
			id: bookDoc.id.toString(),
			title: bookDoc.title,
			status: bookDoc.status || 'inProgress',
			description: bookDoc.description,
			outline: bookDoc.outline,
			oneLiner: bookDoc.oneLiner,
			recall: bookDoc.recall,
			reflect: bookDoc.reflect,
			frontCover: bookDoc.frontCover,
			backCover: bookDoc.backCover,
			createdAt: bookDoc.createdAt,
			lastSaved: bookDoc.lastSaved,
			pages: bookDoc.pages,
		}
		books.push(book)
	}

	const filtered = books
		.filter((book: Book) => !EXCLUDE.includes(book.id))
		.sort((a, b) => a.lastSaved - b.lastSaved)

	return filtered
}
