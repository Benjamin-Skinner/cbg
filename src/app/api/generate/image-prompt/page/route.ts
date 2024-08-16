import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Book, ImagePrompt, Page, PageImage } from '@/types'
import generateImagePrompt from '@/generate/text/imagePrompt'
import { updateBook } from '@/functions/updateBook'
import logger from '@/logging'
import logStatus from '@/util/statusLog'
import { getBookById } from '@/functions/getBookById'
import updatePage from '@/functions/updatePage'
import getPageFromKey from '@/util/pageFromKey'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
		pageKey: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId', 'pageKey'])

	if (isError && error) {
		return error.toResponse()
	}

	const book = await getBookById(params.bookId)
	const page = getPageFromKey(book, params.pageKey)

	try {
		logStatus(
			`IMAGE_PROMPT for page ${page.title}`,
			'requested',
			params.bookId
		)

		const openAiPrompt = `Given the a paragraph of a children's book, create a short description of an image to accompany it. Add one specific relevant detail from the page. Make the prompt short and simple. Base the description closely on the examples below:

    Page: Pirate ships are big boats that sailed the seas long ago. They had big, billowing sails and flags with scary skulls on them. Pirates wore eye patches and carried swords and cannons to fight other ships. They looked for treasure to steal and buried it on secret islands. Pirate ships had names like "Black Pearl" and "Queen Anne's Revenge." They sailed the oceans in search of adventure and gold.
    Image: pirate on a ship, hyperrealistic.

    Page: Viking explorers were brave sailors from Scandinavia. They sailed in big boats called longships. Vikings traveled across oceans, discovering new lands and trading with other countries. They wore helmets with horns and carried shields and swords. Vikings were excellent navigators and warriors. They believed in many gods and goddesses. Today, we can learn about Vikings from their ancient artifacts and stories.
    Image: a brave Viking warrior with a horned helmet in a small boat. Realistic.

    Page: Octopuses are amazing sea creatures with eight long arms called tentacles. They are very good at hiding because they can change color to blend in with their surroundings. Octopuses are smart animals that can open jars and puzzles! They move by pushing water out of their bodies, like a jet. Octopuses live in the ocean and they like to hide in caves and holes. They are great hunters and can catch fish and crabs with their tentacles.
    Image: an octopus hiding in an ocean cave.

    Page: ${page.text.content}
    Image:`

		const newPrompt: ImagePrompt = await generateImagePrompt(
			page.image.prompt,
			openAiPrompt,
			'watercolor clip art on a white background of'
		)

		const newPage: Page = {
			...page,
			image: {
				...page.image,
				prompt: newPrompt,
			},
		}

		const isConclusion = page.key === 'conclusion'
		const isIntro = page.key === 'intro'

		await updatePage(book, newPage, isIntro, isConclusion)

		logStatus(
			`IMAGE_PROMPT for page ${page.title}`,
			'completed',
			params.bookId
		)

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
			`IMAGE_PROMPT for page ${
				page.title
			} generating for ${JSON.stringify(page)}`
		)
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
