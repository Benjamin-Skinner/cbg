import { Blurb, Book, Description } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import generateBlurb from '@/generate/text/blurb'
import { getBookById } from '@/functions/getBookById'
import sleep from '@/util/sleep'
import clientPromise from '@/util/db'
import { ensureParams } from '@/util/ensureParams'
import StatusClass from '@/classes/Status'
import CBGError from '@/classes/Error'

export async function POST(req: Request, res: Response) {
	const params = await req.json()

	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		// Set Status as Generating
		const newStatus = new StatusClass(params.book.blurb.status)
		newStatus.beginGenerating()
		const updatingBlurb: Blurb = {
			...params.book.blurb,
			status: newStatus.toObject(),
		}
		await updateBlurb(params.book, updatingBlurb)

		// Generate Description
		const blurb = await generateBlurb(params.book)
		await updateBlurb(params.book, blurb)

		return NextResponse.json({
			data: blurb,
		})
	} catch (error: any) {
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
