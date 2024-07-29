import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { Book, Cover, PageImage, RandR } from '@/types'
import { updateImages } from '@/generate/image/midjourney'
import updateCover from '@/functions/updateCover'
import { updateBook } from '@/functions/updateBook'

// When called, should check all the images for the randr section, update them, and return the images
export async function POST(req: Request) {
	console.log('UPDATE RANDR API ROUTE')
	try {
		const body = await req.json()
		const { isError, error } = ensureParams(body, ['book'])
		if (isError && error) {
			return error.toResponse()
		}

		const book = body.book as Book

		// If there are no generating images, return the current images
		if (!book.recallAndReflect.image.status.generating.inProgress) {
			console.log('No generating images')
			return NextResponse.json(book.recallAndReflect.image)
		}

		// Get the updated page images
		const newImages = await updateImages(
			book.recallAndReflect.image,
			book.id
		)

		// Update the page's images in the database
		await updateRecallAndReflectImages(body.book as Book, newImages)

		// return the updated images
		return NextResponse.json(newImages)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

/**
 * Takes a book and a PageImage. Sets the PageImage as the image for the RandR section
 */
async function updateRecallAndReflectImages(book: Book, image: PageImage) {
	const newBook = {
		...book,
		recallAndReflect: {
			...book.recallAndReflect,
			image: image,
		},
	}

	console.log('updateRecallAndReflect')

	await updateBook(newBook)
}
