import { Book } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { revalidatePath } from 'next/cache'

export async function PUT(
	req: Request,
	{ params }: { params: { bookId: string } }
) {
	const body = await req.json()
	const { isError, error } = ensureParams(body, ['book', 'fields'])
	if (isError && error) {
		return error.toResponse()
	}

	const book: Book = body.book
	const fields: string[] = body.fields

	try {
		// For any fields that have generating.inProgress, do not update them
		const lastSaved = await updateBook(book, fields)
		revalidatePath(`/`)
		return NextResponse.json({
			lastUpdated: lastSaved,
		})
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
