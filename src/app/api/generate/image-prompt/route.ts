import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page, RandR } from '@/types'
import { Book } from '@/types'
import updatePage from '@/functions/updatePage'
import generateImagePrompt from '@/generate/text/imagePrompt'
import { sleep } from 'openai/core.mjs'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
		page: Page
		intro: boolean
		conclusion: boolean
	} = await req.json()

	const { error, isError } = ensureParams(params, [
		'book',
		'page',
		'intro',
		'conclusion',
	])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		// Set status as generating
		const newStatus = new StatusClass(params.page.image.prompt.status)
		newStatus.beginGenerating()

		// Update the page with the new status; Book is now generating
		const newPage = params.page
		newPage.image.prompt = {
			status: newStatus.toObject(),
			content: '',
		}
		console.log(newPage)
		await updatePage(params.book, newPage, params.intro, params.conclusion)

		// Generate new prompt
		const page = await generateImagePrompt(
			params.book,
			newPage,
			params.intro,
			params.conclusion
		)
		console.log(page)
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
