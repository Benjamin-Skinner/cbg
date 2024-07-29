import { ensureParams } from '@/util/ensureParams'
import sleep from '@/util/sleep'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page, TextGenerationMode } from '@/types'
import { Book } from '@/types'
import generatePageText from '@/generate/text/page'
import updatePage from '@/functions/updatePage'

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

	try {
		// Set status as generating
		const newStatus = new StatusClass(params.page.text.status)
		newStatus.beginGenerating()

		// Update the page with the new status; Book is now generating
		const newPage = params.page
		newPage.text.status = newStatus.toObject()
		await updatePage(params.book, newPage, params.intro, params.conclusion)

		// Generate new text
		const page = await generatePageText(
			params.book,
			newPage,
			params.intro,
			params.conclusion,
			params.mode
		)

		await updatePage(params.book, page, params.intro, params.conclusion)

		return NextResponse.json(
			{
				data: page,
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
