import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import generateOutline from '@/generate/text/outline'
import { Book, BookPages, Outline } from '@/types'
import clientPromise from '@/util/db'
import { NextResponse } from 'next/server'
import logger from '@/logging'
import logStatus from '@/util/statusLog'

export async function POST(req: Request, res: Response) {
	const params = await req.json()

	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	logStatus('OUTLINE', 'requested', params.book.id)

	try {
		// Set Status as Generating
		// const newStatus = new StatusClass(params.book.outline.status)
		// newStatus.beginGenerating()
		// await updateOutline(params.book, params.book.outline)

		// Generate Outline
		const { outline, pages } = await generateOutline(params.book)

		await updateOutline(params.book, outline)

		await updatePages(params.book, pages)

		logStatus('OUTLINE', 'completed', params.book.id)
		return NextResponse.json(
			{
				outline: outline,
				pages: pages,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(
			`OUTLINE generation for book ${params.book.id}: ${error.message}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function updateOutline(book: Book, outline: Outline) {
	console.log('updating book in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { outline } })
}

async function updatePages(book: Book, pages: BookPages) {
	console.log('updating book in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { pages } })
}
