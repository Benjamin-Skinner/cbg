import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { Book, Page, PageImage } from '@/types'
import {
	updateImages,
	createAllImageOptions,
} from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import updatePage from '@/functions/updatePage'
import getPageFromKey from '@/util/pageFromKey'
import updatePageImage from '@/functions/updatePageImage'

/**
 * Should just update the status and then return the new status, nothing else
 * When it is at progress === 100 but not done, the client will call download
 */
export async function POST(req: Request, res: Response) {
	const params: {
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
		console.log('DOWNLOADING IMAGES')

		const book = await getBookById(bookId)
		const page = getPageFromKey(book, pageKey)

		console.log(
			'page.image.generatingImages in dowload route',
			page.image.generatingImages
		)

		const completedImages = await createAllImageOptions(
			page.image,
			params.bookId
		)

		console.log('completedImages', completedImages)

		updatePageImage(bookId, completedImages, pageKey)

		console.log('completedImages', completedImages)

		return NextResponse.json(completedImages)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
