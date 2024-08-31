import CBGError from '@/classes/Error'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import { generateDoc } from '@/util/doc/hard'
import { NextResponse } from 'next/server'
import { validateBook } from '@/util/doc/util'
import { serveWordDocument } from '@/util/download'

export async function GET(
	req: Request,
	{ params }: { params: { bookId: string } }
) {
	try {
		const book = await getBookById(params.bookId)
		logger.error('Downloading hardcover manuscript')
		validateBook(book)
		const { filepath, filename } = await generateDoc(book)
		const file = await serveWordDocument(filepath, filename)
		return file
	} catch (e: any) {
		return new CBGError(
			e.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
