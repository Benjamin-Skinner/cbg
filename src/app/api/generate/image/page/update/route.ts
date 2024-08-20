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
import getPageFromKey from '@/util/pageFromKey'

export async function POST(req: Request, res: Response) {
	const params: {
		// image: PageImage
		bookId: string
		pageKey: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId', 'pageKey'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId
	const pageKey = params.pageKey

	try {
		const book = await getBookById(bookId)
		const page = getPageFromKey(book, pageKey)
		console.log(
			'page.image.status in fetched book in Update route',
			page.image.status
		)
		console.log('POLLING IMAGES')
		// Check the status of the images and update the page
		const newImages = await updateImages(page.image)
		// newImages.status.generating.inProgress = false

		updatePageImage(bookId, newImages, pageKey)

		return NextResponse.json(newImages.status)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
