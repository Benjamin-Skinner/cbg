import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover } from '@/types'
import generateImagePrompt from '@/generate/text/coverImagePrompt'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'
import logger from '@/logging'
import logStatus from '@/util/statusLog'
import { updateInsideCoverPrompt } from '@/functions/updateImagePrompt'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId
	const book = await getBookById(bookId)

	try {
		logStatus('IMAGE_PROMPT_INSIDE_COVER', 'requested', bookId)

		const openAiPrompt = `Generate a description of a feature image for a book called ${book.title}.
    The description should be one short sentence. There should be only one subject, and it should be 
    relevant to the book's content, providing a wholistic view of the book's theme.
    Base it closely on the following examples:
    
    Book: Let's Discover California
    Description: watercolor image of a beach sunset; white background --no background

    Book: Ocean Odyssey
    Description: watercolor image of a wave crashing on a rock; white background --no background
 
    Book: Amazing Animals
    Description: watercolor image of a forest; white background --no background

    Book: Wonders of the World
    Description: watercolor image of a majestic city skyline; white background --no background

    Book: Ocean Odyssey
    Description: watercolor image of a wave crashing on a rock; white background --no background

    Book: ${book.title}
    Description:`

		const newPrompt = await generateImagePrompt(
			book.insideCover.image.prompt,
			openAiPrompt
		)

		await updateInsideCoverPrompt(bookId, newPrompt)
		logStatus('IMAGE_PROMPT_INSIDE_COVER', 'completed', bookId)

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
			`IMAGE PROMPT HARD COVER generating for ${JSON.stringify(
				book.insideCover
			)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
