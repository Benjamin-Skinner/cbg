import { Book, ImageAR, ImageOption } from '@/types'
import { getBookById } from '../getBookById'
import {
	arFromImageDimesions,
	getImageDimensions,
	saveImageAsBlob,
} from '@/util/image'

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

	console.log('height', height)
	console.log('width', width)

	// save the image in the Image Storage and get the URL
	const blob = await saveImageAsBlob(book.id, stream2)

	// Turn it into a new image option
	const newImageOption = {
		url: blob.url,
		error: '',
		type: 'manual' as 'manual' | 'midjourney',
		ar, // extracted from the image
		tiling: false,
	}

	// Save the new Image Option in the database
	console.log('about to save the new image')
	await addImageOption(book, newImageOption)

	// Return the new image option
	return newImageOption
}

export default uploadImage
