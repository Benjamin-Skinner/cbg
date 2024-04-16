import { NextResponse } from 'next/server'
import { createNewBook } from '@/functions/createNewBook'
import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'

export async function POST(request: Request) {
	const params = await request.json()
	const { error, isError } = ensureParams(params, ['title'])

	if (isError && error) {
		return error.toResponse()
	}
	try {
		const title = params.title
		const oneLiner = params.oneLiner

		const newBook = await createNewBook(title, oneLiner)

		if (!newBook) {
			throw new Error('Failed to create new book')
		}
		return NextResponse.json(newBook, {
			status: 200,
		})
	} catch (e: any) {
		return new CBGError(
			e.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
