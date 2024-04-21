import { Book } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { getAllBooks } from '@/functions/getAllBooks'

export async function POST(req: Request) {
	try {
		const books = await getAllBooks()
		return NextResponse.json({
			books,
		})
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
