import CBGError from '@/classes/Error'
import deleteImage from '@/functions/deleteImage'
import { NextResponse } from 'next/server'
import { removeImageOptionPage } from '@/functions/removeImageOption'
import { Book, ImageOption } from '@/types'
import logger from '@/logging'

export async function POST(request: Request) {
	const removeImageOption = (book: Book, url: string) => {
		console.log('removeImageOption')
		// get page Key from url params
		const { searchParams } = new URL(request.url)
		const pageKey = searchParams.get('pageKey')
		if (!pageKey) {
			throw new Error('No pageKey provided')
		}

		return removeImageOptionPage(book, url, pageKey)
	}

	try {
		await deleteImage(request, removeImageOption)
		return NextResponse.json({
			success: true,
		})
	} catch (e: any) {
		logger.error(`DELETING image failed: ${e.message}`)
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
