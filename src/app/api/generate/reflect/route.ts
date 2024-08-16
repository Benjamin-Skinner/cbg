import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { RandR } from '@/types'
import clientPromise from '@/util/db'
import { Book } from '@/types'
import generateReflect from '@/generate/text/reflect'
import logStatus from '@/util/statusLog'
import logger from '@/logging'

export async function POST(req: Request, res: Response) {
	const params = await req.json()
	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		logStatus('REFLECT', 'requested', params.book.id)
		// Set status as generating
		const newStatus = new StatusClass(params.book.outline.status)
		newStatus.beginGenerating()
		await updateReflect(params.book, params.book.reflect)

		// Generate questions
		const reflect = await generateReflect(params.book)
		await updateReflect(params.book, reflect)
		logStatus('REFLECt', 'completed', params.book.id)
		return NextResponse.json(
			{
				data: reflect,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(
			`REFLECT generation for book ${params.book.id}: ${error.message}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function updateReflect(book: Book, reflect: RandR) {
	console.log('updating book in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { reflect } })
}
