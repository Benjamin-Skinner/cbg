import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover } from '@/types'
import generateImagePrompt from '@/generate/text/coverImagePrompt'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import logStatus from '@/util/statusLog'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId

	logStatus('IMAGE_PROMPT_PAPER_COVER', 'requested', bookId)
	const book = await getBookById(bookId)

	try {
		const openAiPrompt = `Generate a description of a front cover image for a children's book called ${book.title}.
    The description should be one short sentence. There should be only one subject.
    Base it closely on the following examples:
    
    Book: Let's Discover California
    Description: image of the California coast with seaside bluffs

    Book: Ocean Odyssey
    Description: image of different fish swimming in the ocean

    Book: ${book.title}
    Description:`

		const newPrompt = await generateImagePrompt(
			book.frontCover.paper.image.prompt,
			openAiPrompt
		)

		const newCover: Cover = {
			...book.frontCover.paper,
			image: {
				...book.frontCover.paper.image,
				prompt: newPrompt,
			},
		}

		await updateBook({
			...book,
			frontCover: {
				...book.frontCover,
				paper: newCover,
			},
		})

		logStatus('IMAGE_PROMPT_PAPER_COVER', 'completed', bookId)

		return NextResponse.json(
			{
				data: newPrompt,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(
			`IMAGE PROMPT PAPER COVER generating for ${JSON.stringify(
				book.frontCover.paper
			)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
