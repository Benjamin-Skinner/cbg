import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page } from '@/types'
import { Book } from '@/types'
import updatePage from '@/functions/updatePage'
import { generateImages } from '@/generate/image/midjourney'
import { DEFAULT_AR } from '@/constants'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const book = await getBookById(params.bookId)

	try {
		const newCoverImage = await generateImages(book.insideCover.image)

		// Save the new cover
		const newBook = {
			...book,
			insideCover: {
				...book.insideCover,
				image: newCoverImage,
			},
		}

		await updateBook(newBook)

		return NextResponse.json(
			{
				data: newCoverImage,
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
