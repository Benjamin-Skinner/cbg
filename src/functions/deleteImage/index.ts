import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { getBookById } from '@/functions/getBookById'
import { Book, PageImage } from '@/types'

async function deleteImage(
	request: Request,
	removeImageOption: (book: Book, url: string) => Promise<PageImage>
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

	const newImage = await removeImageOption(book, url)
	console.log('Deleted from database')

	return newImage
}

export default deleteImage
