import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { RandR, PageImage } from '@/types'
import { Book } from '@/types'
import { sendMidjourneyJob } from '@/generate/image/midjourney'
import { RANDR_IMAGE_AR } from '@/constants'
import { updateBook } from '@/functions/updateBook'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
	} = await req.json()

	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		if (params.book.recallAndReflect.image.prompt.content === '') {
			throw new Error('Please enter a prompt')
		}
		// Set status as generating
		const newStatus = new StatusClass(
			params.book.recallAndReflect.image.status
		)
		newStatus.beginGenerating()
		newStatus.clearMessage()

		// Update the recallAndReflect with the new status; Book is now generating
		const newRecallAndReflect = params.book.recallAndReflect
		newRecallAndReflect.image.status = newStatus.toObject()
		await updateRecallAndReflect(params.book, newRecallAndReflect)

		console.log('Generating Images for RANDR')

		// Generate Images
		const optionGenerating = await sendMidjourneyJob(
			params.book.recallAndReflect.image.prompt.content,
			RANDR_IMAGE_AR,
			'tiling'
		)

		// Update the recallAndReflect with the new image option
		newRecallAndReflect.image.generatingImages.push(optionGenerating)

		await updateRecallAndReflect(params.book, newRecallAndReflect)

		return NextResponse.json(
			{
				data: newRecallAndReflect,
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

async function updateRecallAndReflect(
	book: Book,
	rAndR: {
		image: PageImage
		recall: RandR
		reflect: RandR
	}
) {
	const newBook = {
		...book,
		recallAndReflect: rAndR,
	}

	console.log('updateRecallAndReflect')

	await updateBook(newBook)
}
