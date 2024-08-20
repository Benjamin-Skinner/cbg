import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover, PageImage } from '@/types'
import { generateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import {
	updateInsideCoverPageImage,
	updateRecallAndReflectPageImage,
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
			`MIDJOURNEY request for recall and reflect of book ${params.bookId}`
		)

		const book = await getBookById(params.bookId)

		const imageWithPrompt: PageImage = {
			...book.recallAndReflect.image,
			prompt: {
				...book.recallAndReflect.image.prompt,
				content: params.prompt,
			},
		}

		const newPageImage: PageImage = await generateImages(imageWithPrompt)

		await updateRecallAndReflectPageImage(params.bookId, newPageImage)

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
