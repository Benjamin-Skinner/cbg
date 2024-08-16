import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { RandR } from '@/types'
import clientPromise from '@/util/db'
import { Book } from '@/types'
import generateRecall from '@/generate/text/recall'
import logStatus from '@/util/statusLog'
import logger from '@/logging'

export async function POST(req: Request, res: Response) {
	const params = await req.json()
	const { error, isError } = ensureParams(params, ['book'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		logStatus('RECALL', 'requested', params.book.id)
		// Set status as generating
		const newStatus = new StatusClass(params.book.outline.status)
		newStatus.beginGenerating()
		const generatingRecall = params.book.recallAndReflect.recall
		generatingRecall.status = newStatus.toObject()
		await updateRecall(params.book, generatingRecall)

		// Generate questions
		const recall = await generateRecall(params.book)
		await updateRecall(params.book, recall)
		logStatus('RECALL', 'completed', params.book.id)
		return NextResponse.json(
			{
				data: recall,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(
			`RECALL generation for book ${params.book.id}: ${error.message}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

async function updateRecall(book: Book, recall: RandR) {
	console.log('updating book in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	await books.findOneAndUpdate({ id: book.id }, { $set: { recall } })
}
