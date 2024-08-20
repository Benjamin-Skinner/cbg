import { NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import { getBookById } from '@/functions/getBookById'
import { downloadMidjourneyImage } from '@/util/image'
import { servePng } from '@/util/download'
import CBGError from '@/classes/Error'

export async function GET(
	req: Request,
	{ params }: { params: { bookId: string } }
) {
	try {
		const book = await getBookById(params.bookId)
		const { imgPath } = await downloadMidjourneyImage(
			book.backCover.image.selected.url,
			book
		)

		const servedImage = await servePng(imgPath, 'cover-back-image.png')
		return servedImage
	} catch (error: any) {
		console.error(error)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
