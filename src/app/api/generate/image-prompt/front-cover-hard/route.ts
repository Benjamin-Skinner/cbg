import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover } from '@/types'
import generateImagePrompt from '@/generate/text/coverImagePrompt'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'
import { getRandomChapterTitles } from '@/util/random'
import logger from '@/logging'
import logStatus from '@/util/statusLog'
import { updateHardcoverPrompt } from '@/functions/updateImagePrompt'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId

	logStatus('IMAGE_PROMPT_HARD_COVER', 'requested', bookId)

	const book = await getBookById(bookId)

	try {
		const chapterTitles = getRandomChapterTitles(book, 3)

		const openAiPrompt = `Generate a simple outline of a front cover for a children's book called ${
			book.title
		} and chapters ${chapterTitles.join(
			', '
		)}. The first sentence should begin with "Children's watercolor book cover collage". The last sentence of the prompt should give the title of the book in a "simple authentic children's handwriting style" on a "{color} {setting} sunny day background" where you select a suitable {color} and {setting}.
		Never use the word 'chapters'. Do not use complete sentences. Base it closely on the following examples:

		Book: Lets' Discover California
		Description: Children's watercolor book cover collage of Napa Valley, the California Capital, and the Golden Gate Bridge with "Let's Discover California" text in a simple authentic children's handwriting style on blue sky sunny day background.

		Book: Ocean Odyssey
		Description: Children's watercolor book cover collage of an orca, squid, and blue whale with "Ocean Odyssey" text in a simple authentic children's handwriting style on blue sky sunny day background.

        Book: Gemstone Quest
        Description: Children's watercolor book cover collage of shimmering amethysts, sparkling diamonds, and brilliant emeralds with "Gemstone Quest" text in a whimsical and playful font on a background of a mystical gemstone mine. 

		Book: ${book.title}
		Description:`

		const newPrompt = await generateImagePrompt(
			book.frontCover.hard.image.prompt,
			openAiPrompt
		)

		await updateHardcoverPrompt(bookId, newPrompt)

		logStatus('IMAGE_PROMPT_HARD_COVER', 'completed', bookId)

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
				book.frontCover.hard
			)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
