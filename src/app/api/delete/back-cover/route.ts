import { getBookById } from '@/functions/getBookById'
import BookPagesClass from '@/classes/BookPages'
import { updateBook } from '@/functions/updateBook'
import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import CBGError from '@/classes/Error'

export async function DELETE(request: Request) {
	try {
		const { searchParams } = new URL(request.url)

		const bookId = searchParams.get('bookId')
		const url = searchParams.get('url')

		console.log('url', url)

		if (!url) {
			throw new Error('No url provided')
		}

		if (!bookId) {
			throw new Error('No bookId provided')
		}

		const book = await getBookById(bookId)

		// Make sure the image is not selected
		if (book.backCover.image.image === url) {
			throw new Error('Cannot delete the selected image')
		}

		await del(url)

		// update the database
		const newImageOptions = book.backCover.image.imageOptions.filter(
			(option) => option.url !== url
		)

		const newBook = {
			...book,
			backCover: {
				...book.backCover,
				image: {
					...book.backCover.image,
					imageOptions: newImageOptions,
				},
			},
		}

		await updateBook(newBook)

		return NextResponse.json(newImageOptions)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
