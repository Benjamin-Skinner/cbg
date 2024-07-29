import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { ImagePrompt, PageImage } from '@/types'
import { Book } from '@/types'
import generateRandRImagePrompt from '@/generate/text/randrImagePrompt'
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
		// Set status as generating
		const newStatus = new StatusClass(
			params.book.recallAndReflect.image.prompt.status
		)
		newStatus.beginGenerating()

		// Update the page with the new status; Book is now generating
		const newRandRImage: ImagePrompt = {
			content: params.book.recallAndReflect.image.prompt.content,
			status: newStatus.toObject(),
		}

		await updateRandRImagePrompt(params.book, newRandRImage)

		// Generate new prompt
		const newPrompt = await generateRandRImagePrompt(params.book)

		await updateRandRImagePrompt(params.book, newPrompt)

		return NextResponse.json(
			{
				data: newPrompt,
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

async function updateRandRImagePrompt(book: Book, prompt: ImagePrompt) {
	// Update the book with the new status; Book is now generating
	const newBook = {
		...book,
		recallAndReflect: {
			...book.recallAndReflect,
			image: {
				...book.recallAndReflect.image,
				prompt,
			},
		},
	}

	await updateBook(newBook)
}
