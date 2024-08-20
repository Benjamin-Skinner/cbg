import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page, PageImage } from '@/types'
import { Book } from '@/types'
import updatePage from '@/functions/updatePage'
import { generateImages } from '@/generate/image/midjourney'
import { DEFAULT_AR } from '@/constants'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'
import getPageFromKey from '@/util/pageFromKey'
import logStatus from '@/util/statusLog'
import logger from '@/logging'
import updatePageImage from '@/functions/updatePageImage'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
		pageKey: string
		prompt: string
	} = await req.json()

	const { error, isError } = ensureParams(params, [
		'bookId',
		'prompt',
		'pageKey',
	])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		logger.info(
			`MIDJOURNEY request for page ${params.pageKey} for book ${params.bookId}`
		)

		const book = await getBookById(params.bookId)
		const page = getPageFromKey(book, params.pageKey)

		const pageWithPrompt: Page = {
			...page,
			image: {
				...page.image,
				prompt: {
					...page.image.prompt,
					content: params.prompt,
				},
			},
		}

		const newPageImage: PageImage = await generateImages(
			pageWithPrompt.image
		)

		await updatePageImage(params.bookId, newPageImage, params.pageKey)
		console.log('newPageImage returned from generateImages', newPageImage)

		return NextResponse.json(newPageImage, {
			status: 200,
		})
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
