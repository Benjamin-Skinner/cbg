import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { Book, Page, PageImage } from '@/types'
import {
	updateImages,
	createAllImageOptions,
} from '@/generate/image/midjourney'
import updatePageImage from '@/functions/updatePageImage'
import { getBookById } from '@/functions/getBookById'
import { updateInsideCoverPageImage } from '@/functions/updatePageImage'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId

	try {
		const book = await getBookById(bookId)

		console.log('POLLING IMAGES')
		// Check the status of the images and update the page
		const newImages = await updateImages(book.insideCover.image)

		updateInsideCoverPageImage(bookId, newImages)

		return NextResponse.json(newImages.status)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
