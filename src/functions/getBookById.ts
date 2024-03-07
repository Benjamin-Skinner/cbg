import { Book } from '@/types'
import clientPromise from '@/util/db'

export async function getBookById(bookId: string) {
	const client = await clientPromise
	const db = client.db()
	const bookDoc = await db.collection('books').findOne({ id: bookId })
	if (!bookDoc) throw new Error('No book found')
	const book: Book = {
		id: bookDoc.id.toString(),
		title: bookDoc.title,
		description: bookDoc.description,
		outline: bookDoc.outline,
		recall: bookDoc.recall,
		reflect: bookDoc.reflect,
		frontCover: bookDoc.frontCover,
		backCover: bookDoc.backCover,
		createdAt: bookDoc.createdAt,
		lastSaved: bookDoc.lastSaved,
		pages: bookDoc.pages,
	}
	return book
}
