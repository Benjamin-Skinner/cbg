import { put, del } from '@vercel/blob'
import { NextResponse } from 'next/server'
import CBGError from '@/classes/Error'
import { v4 } from 'uuid'
import { imageName } from '@/util/image'
import { ensureParams } from '@/util/ensureParams'
import { Book } from '@/types'
import BookPagesClass from '@/classes/BookPages'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'
import sleep from '@/util/sleep'

export async function POST(request: Request) {
	try {
		// throw new Error('Something went wrong')
		const { searchParams } = new URL(request.url)
		const pageKey = searchParams.get('page')
		const bookId = searchParams.get('bookId')

		if (!pageKey) {
			throw new Error('No page provided')
		}

		if (!request.body) {
			throw new Error('No file provided')
		}

		if (!bookId) {
			throw new Error('No bookId provided')
		}

		const book = await getBookById(bookId)

		const imageId = v4()
		const name = imageName(pageKey, imageId)

		const blob = await put(name, request.body, {
			access: 'public',
		})

		// save the image in the database
		const newPages = new BookPagesClass(book.pages)
		newPages.addImageOption(
			{
				url: blob.url,
				error: '',
				type: 'manual',
			},
			pageKey
		)

		const newBook = {
			...book,
			pages: newPages.toObject(),
		}

		await updateBook(newBook, [])

		return NextResponse.json(blob)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

export async function DELETE(request: Request) {
	console.log('DELETE IMAGE API ROUTE')
	try {
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

		// If the image is stored in Vercel, delete it
		if (type === 'manual') await del(url)

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
