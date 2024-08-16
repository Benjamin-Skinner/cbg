import { Book, ImageAR, ImageOption } from '@/types'
import { getBookById } from '../getBookById'
import { arFromImageDimesions, getImageDimensions } from '@/util/image'
import { saveImageToAWS } from '@/util/aws/upload'

/**
 * Takes a request which should contain a file and a bookId.
 * It validates the image dimensions and saves the image in the Image Storage.
 * It then creates a new Image Option and saves it in the database.
 * All functions that manually upload an image should use this function.
 */
async function uploadImage(
	request: Request,
	requiredAr: ImageAR,
	// This function saves the new image option to the appropriate field in the book. See functions/addImageOption.ts
	addImageOption: (book: Book, newImageOption: ImageOption) => void
): Promise<ImageOption> {
	// Extract bookId from search Params
	const { searchParams } = new URL(request.url)
	const bookId = searchParams.get('bookId')

	// Make sure there is a file and a bookId
	if (!request.body) {
		throw new Error('No file provided')
	}

	if (!bookId) {
		throw new Error('No bookId provided')
	}

	// Get book from DB
	const book = await getBookById(bookId)

	// Get two copies of the image stream (one for validation, one for saving)
	const [stream1, stream2] = request.body.tee()

	// Validate image dimensions
	const { height, width } = await getImageDimensions(stream1)
	const { ar, error } = arFromImageDimesions(width, height)

	if (
		ar.width !== requiredAr.width ||
		ar.height !== requiredAr.height ||
		error
	) {
		throw new Error(
			`Please upload an image with ar ${requiredAr.width}:${requiredAr.height}`
		)
	}

	// save the image in the Image Storage and get the URL

	const { savedUrl } = await saveImageToAWS(book.id, stream2)

	// Turn it into a new image option
	const newImageOption: ImageOption = {
		url: savedUrl,
		error: '',
		type: 'manual' as 'manual' | 'midjourney',
		ar, // extracted from the image
		tiling: false,
		messageId: '',
	}

	// Save the new Image Option in the database
	await addImageOption(book, newImageOption)

	// Return the new image option
	return newImageOption
}

export default uploadImage
