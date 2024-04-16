import clientPromise from '@/util/db'
import { Book, Cover } from '@/types'

/**
 * @function updatePage
 *
 * @summary
 * Takes a book and cover, and updates the cover in the database.
 *
 * @param {Book} book - The book to update
 * @param {Cover} cover - The new cover to update
 * @param {boolean} front - Whether the cover is a front cover
 * @param {boolean} back - Whether the cover is a back cover
 *
 * @returns
 *
 * @remarks
 */
async function updateCover(
	book: Book,
	cover: Cover,
	front: boolean,
	back: boolean
) {
	console.log('updating cover in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')

	if (front) {
		await books.updateOne(
			{ id: book.id },
			{
				$set: {
					frontCover: cover,
				},
			}
		)
	} else if (back) {
		await books.updateOne(
			{ id: book.id },
			{
				$set: {
					backCover: cover,
				},
			}
		)
		return
	}
}
export default updateCover
