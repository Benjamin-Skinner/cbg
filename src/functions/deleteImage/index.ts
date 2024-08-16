import { getBookById } from '@/functions/getBookById'
import { Book } from '@/types'
import { deleteImageFromAWS } from '@/util/aws/delete'

async function deleteImage(
	request: Request,
	removeImageOption: (book: Book, url: string) => Promise<void>
) {
	const { searchParams } = new URL(request.url)
	const url = searchParams.get('url')
	const bookId = searchParams.get('bookId')

	// Make sure there is a url and a bookId
	if (!url) {
		throw new Error('No url provided')
	}

	if (!bookId) {
		throw new Error('No bookId provided')
	}

	const book = await getBookById(bookId)

	// Delete from the Image Storage
	await deleteImageFromAWS(url)

	const newImage = await removeImageOption(book, url)

	return newImage
}

export default deleteImage
