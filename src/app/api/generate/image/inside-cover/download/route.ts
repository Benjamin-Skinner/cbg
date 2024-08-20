import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { createAllImageOptions } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import { updateInsideCoverPageImage } from '@/functions/updatePageImage'

/**
 * Should just update the status and then return the new status, nothing else
 * When it is at progress === 100 but not done, the client will call download
 */
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
		console.log('DOWNLOADING IMAGES')

		const book = await getBookById(bookId)

		const completedImages = await createAllImageOptions(
			book.insideCover.image,
			params.bookId
		)

		console.log('completedImages', completedImages)

		updateInsideCoverPageImage(bookId, completedImages)

		console.log('completedImages', completedImages)
		logger.info('Downloaded new images for inside cover')

		return NextResponse.json(completedImages)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
