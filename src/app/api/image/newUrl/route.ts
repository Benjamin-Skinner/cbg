// import CBGError from '@/classes/Error'
// import { ensureParams } from '@/util/ensureParams'
// import sleep from '@/util/sleep'
// import { NextResponse } from 'next/server'
// import { Book, Page, PageImage } from '@/types'
// import updatePageImage from '@/functions/updatePageImage'
// import { updateImages } from '@/generate/image/midjourney'
// import StatusClass from '@/classes/Status'

// export async function POST(req: Request) {
// 	console.log('NEW URL API ROUTE')
// 	try {
// 		const body = await req.json()
// 		const { isError, error } = ensureParams(body, [
// 			'book',
// 			'page',
// 			'intro',
// 			'conclusion',
// 		])
// 		if (isError && error) {
// 			return error.toResponse()
// 		}

// 		const page = body.page as Page
// 		const images = body.page.image as PageImage

// 		// Get the updated page images

// 		// Update the page's images in the database
// 		await updatePageImage(
// 			body.book as Book,
// 			newImages,
// 			body.page.key,
// 			body.intro,
// 			body.conclusion
// 		)

// 		// return the updated images
// 		return NextResponse.json(newImages)
// 	} catch (e: any) {
// 		return new CBGError(
// 			e.message || 'An error occurred',
// 			500,
// 			'INTERNAL_SERVER_ERROR'
// 		).toResponse()
// 	}
// }
