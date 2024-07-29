import { Book, Description } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import generateDescription from '@/generate/text/description'
import { getBookById } from '@/functions/getBookById'
import sleep from '@/util/sleep'
import clientPromise from '@/util/db'
import { ensureParams } from '@/util/ensureParams'
import StatusClass from '@/classes/Status'
import CBGError from '@/classes/Error'

export async function POST(req: Request, res: Response) {
	const params = await req.json()

	const { error, isError } = ensureParams(params, ['book', 'type'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		// Set Status as Generating
		const newStatus = new StatusClass(params.book.description.status)
		newStatus.beginGenerating()
		await updateDescription(params.book, params.book.description)

		// Generate Description
		const description = await generateDescription(params.book, params.type)
		await updateDescription(params.book, description)

		return NextResponse.json({
			data: description,
		})
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function updateDescription(book: Book, description: Description) {
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { description } })
}
