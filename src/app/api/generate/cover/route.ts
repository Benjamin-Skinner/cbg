import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Cover, Page } from '@/types'
import { Book } from '@/types'
import updatePage from '@/functions/updatePage'
import { sendMidjourneyJob } from '@/generate/image/midjourney'
import updateCover from '@/functions/updateCover'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
		cover: Cover
		front: boolean
		back: boolean
	} = await req.json()

	const { error, isError } = ensureParams(params, [
		'book',
		'cover',
		'front',
		'back',
	])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		if (params.cover.image.prompt.content === '') {
			throw new Error('Please enter a prompt')
		}
		// Set status as generating
		const newStatus = new StatusClass(params.cover.image.status)
		newStatus.beginGenerating()
		newStatus.clearMessage()

		// Update the cover with the new status; Book is now generating
		const newCover = params.cover
		newCover.image.status = newStatus.toObject()
		await updateCover(params.book, newCover, params.front, params.back)

		// Generate Images
		const optionGenerating = await sendMidjourneyJob(
			params.cover.image.prompt.content
		)

		// // Update the page with the new image option
		newCover.image.generatingImages.push(optionGenerating)

		await updateCover(params.book, newCover, params.front, params.back)

		return NextResponse.json(
			{
				data: newCover,
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
