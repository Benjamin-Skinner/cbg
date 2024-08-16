import { Blurb, Book, Description } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import generateBlurb from '@/generate/text/blurb'
import { getBookById } from '@/functions/getBookById'
import clientPromise from '@/util/db'
import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import logger from '@/logging'
import logStatus from '@/util/statusLog'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
	} = await req.json()

	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	logStatus('BLURB', 'requested', params.book.id)
	try {
		// Generate Description
		const blurb = await generateBlurb(params.book)
		await updateBlurb(params.book, blurb)

		logStatus('BLURB', 'completed', params.book.id)
		return NextResponse.json({
			data: blurb,
		})
	} catch (error: any) {
		logger.error(
			`BLURB generating for book ${JSON.stringify(params.book.blurb)}: ${
				error.message
			}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function updateBlurb(book: Book, blurb: Blurb) {
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { blurb } })
}
