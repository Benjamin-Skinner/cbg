import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { getBookById } from '@/functions/getBookById'
import { Book, ImageOption } from '@/types'

type ImageKey =
	| 'insideCover'
	| 'backCover'
	| 'frontCover-hard'
	| 'frontCover-paper'

async function deleteImage(
	request: Request,
	imageKey: ImageKey,
	removeImageOption: (book: Book, url: string) => Promise<ImageOption[]>
) {
	console.log('Deleting an image')
	// Extract bookId from search Params
	const { searchParams } = new URL(request.url)

	const bookId = searchParams.get('bookId')
	const url = searchParams.get('url')

	// Make sure there is a url and a bookId
	if (!url) {
		throw new Error('No url provided')
	}

	if (!bookId) {
		throw new Error('No bookId provided')
	}

	console.log('url', url)

	// Get book from DB
	const book = await getBookById(bookId)

	const selectedUrl = getSelectedImage(book, imageKey)
	console.log('selectedUrl', selectedUrl)
	// Make sure the image is not selected
	if (selectedUrl === url) {
		throw new Error('Cannot delete the selected image')
	}

	// Delete from the Image Storage
	await del(url)
	console.log('Deleted from storage')

	// update the database
	// const newImageOptions = book.backCover.image.imageOptions.filter(
	// 	(option) => option.url !== url
	// )

	// const newBook = {
	// 	...book,
	// 	backCover: {
	// 		...book.backCover,
	// 		image: {
	// 			...book.backCover.image,
	// 			imageOptions: newImageOptions,
	// 		},
	// 	},
	// }

	// await updateBook(newBook)

	const newImageOptions = await removeImageOption(book, url)
	console.log('Deleted from database')

	return newImageOptions
}

export default deleteImage

function getSelectedImage(book: Book, key: ImageKey) {
	if (key === 'insideCover') {
		return book.insideCover.image.image
	}

	if (key === 'backCover') {
		return book.backCover.image.image
	}

	if (key === 'frontCover-hard') {
		return book.frontCover.paper.image.image
	}

	if (key === 'frontCover-paper') {
		return book.frontCover.hard.image.image
	}
}
