import { getBookById } from '@/functions/getBookById'
import { bookName, generateDoc } from '@/util/doc'
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
		const fileContent = fs.readFileSync(filepath, 'utf-8')

		return new NextResponse(fileContent, {
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				'Content-Disposition': `attachment; filename="${title}.docx"'`,
			},
		})

		// await generateDoc(book, body.version)

		// const fileContent = fs.readFileSync(
		// 	`/Users/Benskinner/Code/cbg/docs/${title}.docx`,
		// 	'utf-8'
		// )

		// const headers = {
		// 	'Content-Disposition': `attachment; filename="${title}.docx"`,
		// 	'Content-Type': 'text/plain',
		// }
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
