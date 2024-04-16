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
export async function updateBook(book: Book, fields: string[] = []) {
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	const query = { id: book.id }
	const savingTime = Date.now()

	if (fields.length === 0) {
		const replacement = { ...book, lastSaved: savingTime }
		await books.replaceOne(query, replacement)
	} else {
		const updateDoc = {
			$set: {
				lastSaved: savingTime,
				...fields.reduce((acc, field) => {
					// @ts-ignore
					acc[field] = book[field]
					return acc
				}, {}),
			},
		}
		await books.updateOne(query, updateDoc)
		console.log('book updated fields: ', fields.toString())
	}

	return savingTime
}
