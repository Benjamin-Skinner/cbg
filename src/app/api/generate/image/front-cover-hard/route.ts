import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover, PageImage } from '@/types'
import { generateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import { updateFrontCoverHard } from '@/functions/updatePageImage'

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
			`MIDJOURNEY request for front cover hard of book ${params.bookId}`
		)

		const book = await getBookById(params.bookId)

		const frontCoverHard: Cover = {
			...book.frontCover.hard,
			image: {
				...book.frontCover.hard.image,
				prompt: {
					...book.frontCover.hard.image.prompt,
					content: params.prompt,
				},
			},
		}

		const newPageImage: PageImage = await generateImages(
			frontCoverHard.image
		)

		await updateFrontCoverHard(params.bookId, newPageImage)

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
