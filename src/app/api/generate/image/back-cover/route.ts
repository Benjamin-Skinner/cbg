import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { generateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'
import logger from '@/logging'
import { Book } from '@/types'

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
		logger.info(`MIDJOURNEY request for back cover for book ${book.id}`)
		const newCoverImage = await generateImages(book.backCover.image)

		// Save the new cover
		const newBook: Book = {
			...book,
			backCover: {
				...book.backCover,
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
