import { getBookById } from '@/functions/getBookById'
import BookPagesClass from '@/classes/BookPages'
import { updateBook } from '@/functions/updateBook'
import { del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import CBGError from '@/classes/Error'

export async function DELETE(request: Request) {
	console.log('DELETE IMAGE API ROUTE')

	try {
		// throw new Error('Not implemented')
		const { searchParams } = new URL(request.url)
		const pageKey = searchParams.get('page')
		const bookId = searchParams.get('bookId')
		const url = searchParams.get('url')
		const type = searchParams.get('type')

		console.log('pageKey', pageKey)
		console.log('url', url)
		console.log('type', type)

		if (!pageKey) {
			throw new Error('No page provided')
		}

		if (!url) {
			throw new Error('No url provided')
		}

		if (!bookId) {
			throw new Error('No bookId provided')
		}

		const book = await getBookById(bookId)

		await del(url)

		// update the database
		const newPages = new BookPagesClass(book.pages)
		newPages.removeImageOption(url, pageKey)

		console.log(
			'newPages',
			newPages.toObject().chapters[0].image.imageOptions
		)

		const newBook = {
			...book,
			pages: newPages.toObject(),
		}

		await updateBook(newBook)

		return NextResponse.json({
			url: url,
		})
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
