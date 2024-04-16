import { Book } from '@/types'
import { updateBook } from '@/functions/updateBook'
import { NextResponse } from 'next/server'
import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { getAlllBooks } from '@/functions/getAllBooks'

export async function GET(req: Request) {
	try {
		const books = await getAlllBooks()
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
