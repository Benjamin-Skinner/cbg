import CBGError from '@/classes/Error'
import uploadImage from '@/functions/uploadImage'
import { NextResponse } from 'next/server'
import { SQUARE_AR } from '@/constants'
import { addImageOptionPage } from '@/functions/addImageOption'
import { Book, ImageOption } from '@/types'
import logger from '@/logging'
import logStatus from '@/util/statusLog'
import { getBookById } from '@/functions/getBookById'
import getPageFromKey from '@/util/pageFromKey'

export async function POST(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const pageKey = searchParams.get('pageKey')
		const bookId = searchParams.get('bookId')
		if (!pageKey) {
			throw new Error('No pageKey provided')
		}
		if (!bookId) {
			throw new Error('No bookId provided')
		}
		const book = await getBookById(bookId)
		const page = getPageFromKey(book, pageKey)
		const ar = page.image.ar
		const addImageOption = (book: Book, option: ImageOption) => {
			// get page Key from url params
			addImageOptionPage(book, pageKey, option)
		}

		const newImageOption = await uploadImage(request, ar, addImageOption)
		return NextResponse.json(newImageOption)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
