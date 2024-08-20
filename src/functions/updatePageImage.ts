// async function updateImageInDB(book: Book, page: Page, images: PageImage) {}

import clientPromise from '@/util/db'
import { Book, PageImage } from '@/types'
import { getPageIndexInChapters } from '@/util/pageFromKey'

/**
 * @function updatePage
 *
 * @summary
 * Updates the page subfield of a page in the database.
 *
 * @param {string} bookId - The book to update
 * @param {Page} images - The new page.image to update
 * @param {string} pageKey - The key of the page to update

 *
 * @returns
 *
 * @remarks
 */
async function updatePageImage(
	bookId: string,
	images: PageImage,
	pageKey: string
) {
	console.log('Updating page image')

	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')

	if (pageKey === 'intro') {
		// Update the intro page
		await books.updateOne(
			{ id: bookId },
			{
				$set: {
					'pages.intro.image': images,
				},
			}
		)
		return
	}

	if (pageKey === 'conclusion') {
		// Update the conclusion page
		await books.updateOne(
			{ id: bookId },
			{
				$set: {
					'pages.conclusion.image': images,
				},
			}
		)
		return
	}

	// Update the chapter page
	const res = await books.updateOne(
		{
			id: bookId,
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

export async function updateInsideCoverPageImage(
	bookId: string,
	image: PageImage
) {
	const client = await clientPromise
	const db = client.db()

	await db.collection('books').findOneAndUpdate(
		{ id: bookId },
		{
			$set: {
				'insideCover.image': image,
			},
		}
	)
}

export async function updateBackCoverPageImage(
	bookId: string,
	image: PageImage
) {
	const client = await clientPromise
	const db = client.db()

	await db.collection('books').findOneAndUpdate(
		{ id: bookId },
		{
			$set: {
				'backCover.image': image,
			},
		}
	)
}

export async function updateFrontCoverHard(bookId: string, image: PageImage) {
	const client = await clientPromise
	const db = client.db()

	await db.collection('books').findOneAndUpdate(
		{ id: bookId },
		{
			$set: {
				'frontCover.hard.image': image,
			},
		}
	)
}

export async function updateFrontCoverPaperPageImage(
	bookId: string,
	image: PageImage
) {
	const client = await clientPromise
	const db = client.db()

	await db.collection('books').findOneAndUpdate(
		{ id: bookId },
		{
			$set: {
				'frontCover.paper.image': image,
			},
		}
	)
}

export async function updateRecallAndReflectPageImage(
	bookId: string,
	image: PageImage
) {
	const client = await clientPromise
	const db = client.db()

	await db.collection('books').findOneAndUpdate(
		{ id: bookId },
		{
			$set: {
				'recallAndReflect.image': image,
			},
		}
	)
}
