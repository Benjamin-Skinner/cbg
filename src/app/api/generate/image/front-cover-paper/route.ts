import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover, PageImage } from '@/types'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import { updateFrontCoverPaperPageImage } from '@/functions/updatePageImage'
import { generateRemixImages } from '@/generate/image/remix'

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
			`MIDJOURNEY request for front cover paper of book ${params.bookId}`
		)

		const book = await getBookById(params.bookId)

		const frontCoverPaperImage: PageImage = {
			...book.frontCover.paper.image,
			prompt: {
				...book.frontCover.paper.image.prompt,
				content: params.prompt,
			},
		}

		const newPageImage: PageImage = await generateRemixImages(
			frontCoverPaperImage,
			book.frontCover.paper.image.selected.messageId
		)

		await updateFrontCoverPaperPageImage(params.bookId, newPageImage)

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
