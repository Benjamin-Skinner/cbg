import clientPromise from '@/util/db'
import { Book, Page } from '@/types'

/**
 * @function updatePage
 *
 * @summary
 * Takes a book and page, and updates the page in the database.
 * Works for any page, including intro and conclusion.
 *
 * @param {Book} book - The book to update
 * @param {Page} page - The page to update
 * @param {boolean} intro - Whether the page is an intro
 * @param {boolean} conclusion - Whether the page is a conclusion
 *
 * @returns
 *
 * @remarks
 */
async function updatePage(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
) {
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')

	if (intro) {
		// Update the intro page
		await books.updateOne(
			{ id: book.id },
			{
				$set: {
					'pages.intro': page,
				},
			}
		)
		return
	}

	if (conclusion) {
		// Update the conclusion page
		await books.updateOne(
			{ id: book.id },
			{
				$set: {
					'pages.conclusion': page,
				},
			}
		)
		return
	}

	// Update the chapter page
	await books.updateOne(
		{
			id: book.id,
		},
		{
			$set: {
				'pages.chapters.$[elem]': page,
			},
		},
		{
			arrayFilters: [{ 'elem.key': page.key }],
		}
	)
}
export default updatePage
