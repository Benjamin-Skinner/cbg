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

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
		pageKey: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const book = await getBookById(params.bookId)
	const page = getPageFromKey(book, params.pageKey)

	try {
		logger.info(
			`MIDJOURNEY request for page ${page.title} for book ${book.id}`
		)

		const newPageImage: PageImage = await generateImages(page.image)
		const newPage: Page = {
			...page,
			image: newPageImage,
		}

		const isIntro = params.pageKey === 'intro'
		const isConclusion = params.pageKey === 'conclusion'

		// Save the new page
		await updatePage(book, newPage, isIntro, isConclusion)

		return NextResponse.json(
			{
				data: newPageImage,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
