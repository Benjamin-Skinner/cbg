import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { Book, Page, PageImage } from '@/types'
import { updateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import { updateBook } from '@/functions/updateBook'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	console.log('UPDATING IMAGES')
	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		const book = await getBookById(params.bookId)

		// If there are no generating images, return the current images
		if (!book.frontCover.hard.image.status.generating.inProgress) {
			console.log('No generating images')
			return NextResponse.json(book.frontCover.hard.image)
		}

		// Get the updated page images
		const newImages = await updateImages(
			book.frontCover.hard.image,
			book.id
		)

		// Save the new cover
		const newBook: Book = {
			...book,
			frontCover: {
				...book.frontCover,
				hard: {
					...book.frontCover.hard,
					image: newImages,
				},
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
