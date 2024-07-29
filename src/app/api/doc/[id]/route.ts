import { getBookById } from '@/functions/getBookById'
import { bookName } from '@/util/doc/util'
import { generateDoc } from '@/util/doc'
import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import fs from 'fs'
import { NextResponse } from 'next/server'

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const book = await getBookById(params.id)
		const body = await req.json()
		const { isError, error } = ensureParams(body, ['version', 'type'])
		if (isError && error) {
			return error.toResponse()
		}

		const title = bookName(book.title, body.version)
		const filepath = `/Users/Benskinner/Code/cbg/docs/${title}.docx`

		// try {
		await generateDoc(book, body.version, filepath)
		// } catch (error) {
		// 	console.log('REDOWNLOADING IMAGES')
		// 	// throw error
		// 	const updatedBook = await getNewImageUrls(book)
		// 	await generateDoc(updatedBook, body.version, filepath)
		// }

		return NextResponse.json({ filepath })
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
