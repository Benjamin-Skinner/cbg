import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { updateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		const book = await getBookById(params.bookId)

		// Get the updated page images
		const newImages = await updateImages(book.backCover.image, book.id)

		// Save the new cover
		const newBook = {
			...book,
			backCover: {
				...book.backCover,
				image: newImages,
			},
		}

		await updateBook(newBook)

		// return the updated images
		return NextResponse.json({
			data: newImages,
		})
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
