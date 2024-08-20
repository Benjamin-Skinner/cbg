import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page, TextGenerationMode } from '@/types'
import { Book } from '@/types'
import generatePageText from '@/generate/text/page'
import updatePage from '@/functions/updatePage'
import logger from '@/logging'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
		page: Page
		intro: boolean
		conclusion: boolean
		mode: TextGenerationMode
	} = await req.json()

	const { error, isError } = ensureParams(params, [
		'book',
		'page',
		'intro',
		'conclusion',
		'mode',
	])

	if (isError && error) {
		return error.toResponse()
	}

	logger.info(
		`TEXT requested page ${params.page.title} in book ${params.book.id} with mode: ${params.mode}`
	)

	try {
		// Generate new text
		const page = await generatePageText(
			params.book,
			params.page,
			params.intro,
			params.conclusion,
			params.mode
		)

		await updatePage(params.book, page, params.intro, params.conclusion)

		logger.info(
			`TEXT successfullly generated page ${params.page.title} in book ${params.book.id}`
		)

		return NextResponse.json(
			{
				data: page,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(
			`TEXT generating in book ${params.book.id}: ${
				error.message
			} ${JSON.stringify(params.page.text)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
