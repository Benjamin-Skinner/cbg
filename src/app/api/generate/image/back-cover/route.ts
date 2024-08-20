import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover, PageImage } from '@/types'
import { generateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import {
	updateBackCoverPageImage,
	updateInsideCoverPageImage,
} from '@/functions/updatePageImage'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
		prompt: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId', 'prompt'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		logger.info(
			`MIDJOURNEY request for back cover of book ${params.bookId}`
		)

		const book = await getBookById(params.bookId)

		const backCoverWithPrompt: Cover = {
			...book.backCover,
			image: {
				...book.backCover.image,
				prompt: {
					...book.backCover.image.prompt,
					content: params.prompt,
				},
			},
		}

		const newPageImage: PageImage = await generateImages(
			backCoverWithPrompt.image
		)

		await updateBackCoverPageImage(params.bookId, newPageImage)
		console.log('A generatingImage option has been added')

		return NextResponse.json(newPageImage, {
			status: 200,
		})
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
