import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover, RandR, RecallAndReflect } from '@/types'
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
	const book = await getBookById(bookId)

	try {
		logStatus('IMAGE_PROMPT_RANDR', 'requested', bookId)

		const openAiPrompt = `Given the title of a children's book, give me a simple idea for a wallpaper pattern relevant to the subject matter of the book. The description should be interesting as a tiled wallpaper pattern. Follow the examples:

    Title: "Journey Through the Jungle"
    Image: watercolor clip art on white background of a forest of trees with animals in it

    Title: "Wonders of the World"
    Image: watercolor clip art on white background of skyline of a city with skyscrapers

    Title: "Mystery of the Moon"
    Image: watercolor clip art on white background of a starry night with the moon in different phases

    Title: "Adventures in History"
    Image: watercolor clip art on white background of an ocean with a Viking ship sailing across it

    Title: "The Solar System Safari"
    Image: watercolor clip art on white background of a space scene with planets and stars

    Title: "Lets Discover California"
    Image: watercolor clip art on white background of mountains with snow on top

    Title: "Ocean Odyssey"
    Image: watercolor clip art on white background of an underwater scene with fish and coral

    Title: "${book.title}"
    Image:`

		const newPrompt = await generateImagePrompt(
			book.recallAndReflect.image.prompt,
			openAiPrompt
		)

		const newRecallAndReflect: RecallAndReflect = {
			...book.recallAndReflect,
			image: {
				...book.recallAndReflect.image,
				prompt: newPrompt,
			},
		}

		await updateBook({
			...book,
			recallAndReflect: newRecallAndReflect,
		})

		logStatus('IMAGE_PROMPT_RANDR', 'completed', bookId)

		return NextResponse.json(
			{
				data: newPrompt,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		logger.error(`IMAGE_PROMPT_RANDR generating for book ${book.id}`)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
