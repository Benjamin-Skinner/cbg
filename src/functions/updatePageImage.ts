// async function updateImageInDB(book: Book, page: Page, images: PageImage) {}

import clientPromise from '@/util/db'
import { Book, PageImage } from '@/types'

/**
 * @function updatePage
 *
 * @summary
 * Updates the page subfield of a page in the database.
 *
 * @param {Book} book - The book to update
 * @param {Page} images - The new page.image to update
 * @param {string} pageKey - The key of the page to update
 * @param {boolean} intro - Whether the page is an intro
 * @param {boolean} conclusion - Whether the page is a conclusion
 *
 * @returns
 *
 * @remarks
 */
async function updatePageImage(
	book: Book,
	images: PageImage,
	pageKey: string,
	intro: boolean,
	conclusion: boolean
) {
	console.log('updating page image in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')

	if (intro) {
		// Update the intro page
		await books.updateOne(
			{ id: book.id },
			{
				$set: {
					'pages.intro.image': images,
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
					'pages.conclusion.image': images,
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
				'pages.chapters.$[elem].image': images,
			},
		},
		{
			arrayFilters: [{ 'elem.key': pageKey }],
		}
	)
}
export default updatePageImage
