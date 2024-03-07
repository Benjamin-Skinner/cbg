import { Book } from '@/types'
import clientPromise from '@/util/db'

/**
 * @function updateBook
 *
 * @summary
 * Takes a book object and updates it in the database.
 *
 * @param   {Book} book The book object to update.
 *
 * @returns {number} The time the book was saved.
 *
 * @remarks
 */
export async function updateBook(book: Book) {
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	const query = { id: book.id }
	const savingTime = Date.now()
	const replacement = { ...book, lastSaved: savingTime }
	await books.replaceOne(query, replacement)
	console.log('book updated')
	return savingTime
}
