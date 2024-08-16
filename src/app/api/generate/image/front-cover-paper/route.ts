import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import {
	generateRemixImages,
	getHardcoverMessageIdFromUrl,
} from '@/generate/image/remix'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'
import { Book } from '@/types'
import logger from '@/logging'

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
		logger.info(
			`MIDJOURNEY request for front cover paper for book ${book.id}`
		)

		// Make sure a hardcover image has been selected
		if (!book.frontCover.hard.image.selected.url) {
			throw new Error('Please select a hardcover image first')
		}

		const newCoverImage = await generateRemixImages(
			book.frontCover.paper.image,
			book.frontCover.hard.image.selected.messageId
		)

		console.log('newCoverImage', newCoverImage)

		// Save the new cover
		const newBook: Book = {
			...book,
			frontCover: {
				...book.frontCover,
				paper: {
					...book.frontCover.paper,
					image: newCoverImage,
				},
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
		logger.error(
			`FRONT COVER PAPER IMAGE generation for book ${
				book.id
			}: ${JSON.stringify(error)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
