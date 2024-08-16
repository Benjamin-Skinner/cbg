import { Book, ImageOption, Page, PageImage, SelectedImage } from '@/types'
import { updateBook } from '@/functions/updateBook'
import getPageFromKey, { getPageIndexInChapters } from '@/util/pageFromKey'
import updatePage from '@/functions/updatePage'
import logger from '@/logging'
import clientPromise from '@/util/db'

export async function removeImageOptionInsideCover(
	book: Book,
	url: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	// Determine what the new selected image is; either blank or the same
	const selectedImage: SelectedImage =
		book.insideCover.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.insideCover.image.selected

	// Remove it
	await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { 'insideCover.image.imageOptions': { url } },
			$set: { 'insideCover.image.selected': selectedImage },
		}
	)
}

export async function removeImageOptionFrontCoverHard(
	book: Book,
	url: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	// Determine what the new selected image is; either blank or the same
	const selectedImage: SelectedImage =
		book.frontCover.hard.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.frontCover.hard.image.selected

	// Remove it
	const res = await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { 'frontCover.hard.image.imageOptions': { url } },
			$set: { 'frontCover.hard.image.selected': selectedImage },
		}
	)
}

export async function removeImageOptionFrontCoverPaper(
	book: Book,
	url: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	// Determine what the new selected image is; either blank or the same
	const selectedImage: SelectedImage =
		book.frontCover.paper.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.frontCover.paper.image.selected

	// Remove it
	await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { 'frontCover.paper.image.imageOptions': { url } },
			$set: { 'frontCover.paper.image.selected': selectedImage },
		}
	)
}

export async function removeImageOptionBackCover(
	book: Book,
	url: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	// Determine what the new selected image is; either blank or the same
	const selectedImage: SelectedImage =
		book.backCover.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.backCover.image.selected

	// Remove it
	await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { 'backCover.image.imageOptions': { url } },
			$set: { 'backCover.image.selected': selectedImage },
		}
	)
}

export async function removeImageOptionPage(
	book: Book,
	url: string,
	pageKey: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	const selectedImage: SelectedImage =
		book.backCover.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.backCover.image.selected

	let pagePath: string

	if (pageKey === 'intro') {
		pagePath = 'pages.intro.image'
	} else if (pageKey === 'conclusion') {
		pagePath = 'pages.conclusion.image'
	} else {
		// Dynamically determine the index of the page within the chapters array
		const pageIndex = getPageIndexInChapters(book, pageKey)
		pagePath = `pages.chapters.${pageIndex}.image`
	}

	await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { [`${pagePath}.imageOptions`]: { url } }, // Remove the image option
			$set: { [`${pagePath}.selected`]: selectedImage },
		}
	)

	logger.info(`Deleted image option for page ${pageKey} of book ${book.id}`)
}

export async function removeImageOptionRecallAndReflect(
	book: Book,
	url: string
): Promise<void> {
	const client = await clientPromise
	const db = client.db()

	console.log('removeImageOptionRecallAndReflect')

	// Determine what the new selected image is; either blank or the same
	const selectedImage: SelectedImage =
		book.recallAndReflect.image.selected.url === url
			? { url: '', messageId: '', type: '' }
			: book.recallAndReflect.image.selected

	// Remove it
	await db.collection('books').updateOne(
		{ id: book.id },
		{
			$pull: { 'recallAndReflect.image.imageOptions': { url } },
			$set: { 'recallAndReflect.image.selected': selectedImage },
		}
	)
}
