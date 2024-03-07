import { Book } from '@/types'
import clientPromise from '@/util/db'

/**
 * @function updateBook
 *
 * @summary
 * Takes a book object and updates every field, except where generating.inProgress is true.
 *
 * @param   {Book} book The book object to update.
 *
 * @returns
 *
 * @remarks
 */
// export async function updateNongeneratingFields(book: Book) {
// 	const client = await clientPromise
// 	const db = client.db()
// 	const books = db.collection('books')
//     const bookDoc = books.findOne({ id: book.id })

//     const newValues = {
//         ...book,
//         lastSaved: Date.now()
    // }


	// const client = await clientPromise
	// const db = client.db()
	// const books = db.collection('books')
	// const query = { id: book.id }
	// const savingTime = Date.now()
	// const replacement = { ...book, lastSaved: savingTime }
	// await books.replaceOne(query, replacement)
	// return savingTime
}
