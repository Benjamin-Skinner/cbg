import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import sleep from '@/util/sleep'
import { NextResponse } from 'next/server'
import { Book, Cover, PageImage } from '@/types'
import updatePageImage from '@/functions/updatePageImage'
import { updateImages } from '@/generate/image/midjourney'
import StatusClass from '@/classes/Status'
import updateCover from '@/functions/updateCover'

export async function POST(req: Request) {
	console.log('UPDATE COVER API ROUTE')
	try {
		const body = await req.json()
		const { isError, error } = ensureParams(body, [
			'book',
			'cover',
			'front',
			'back',
		])
		if (isError && error) {
			return error.toResponse()
		}

		const book = body.book as Book
		const cover = body.cover as Cover
		const images = body.cover.image as PageImage

		// If there are no generating images, return the current images
		if (!cover.image.status.generating.inProgress) {
			console.log('No generating images')
			return NextResponse.json(images)
		}

		// Get the updated page images
		const newImages = await updateImages(images, book.id)

		const newCover: Cover = {
			...cover,
			image: newImages,
		}

		// Update the page's images in the database
		await updateCover(
			body.book as Book,
			newCover,
			body.front as boolean,
			body.back as boolean
		)

		// return the updated images
		return NextResponse.json(newImages)
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
