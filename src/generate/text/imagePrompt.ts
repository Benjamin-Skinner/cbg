import { Page, Book } from '@/types'
import StatusClass from '@/classes/Status'
import { sleep } from 'openai/core.mjs'
import generateText from './openai'

async function generateImagePrompt(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
): Promise<Page> {
	const newStatus = new StatusClass(page.image.status)
	try {
		const newPrompt = await getMidjourneyPrompt(page, book)
		newStatus.setAsSuccess()
		return {
			...page,
			image: {
				...page.image,
				prompt: {
					status: newStatus.toObject(),
					content: newPrompt,
				},
			},
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		// Return the old page but with the error
		return {
			...page,
			image: {
				...page.image,
				prompt: {
					status: newStatus.toObject(),
					content: page.image.prompt.content,
				},
			},
		}
	}
}

export default generateImagePrompt

async function getMidjourneyPrompt(page: Page, book: Book) {
	const prompt = `Given the a paragraph of a children's book, create a short description of an image to accompany it. Add a single specific relevant detail from the page. You must use the words "white background" and "watercolor". Base the image closely on the examples below:

    Page: Pirate ships are big boats that sailed the seas long ago. They had big, billowing sails and flags with scary skulls on them. Pirates wore eye patches and carried swords and cannons to fight other ships. They looked for treasure to steal and buried it on secret islands. Pirate ships had names like "Black Pearl" and "Queen Anne's Revenge." They sailed the oceans in search of adventure and gold.
    Image: watercolor of pirate on a ship on a white background, hyperrealistic. bright colors. 

    Page: Viking explorers were brave sailors from Scandinavia. They sailed in big boats called longships. Vikings traveled across oceans, discovering new lands and trading with other countries. They wore helmets with horns and carried shields and swords. Vikings were excellent navigators and warriors. They believed in many gods and goddesses. Today, we can learn about Vikings from their ancient artifacts and stories.
    Image: watercolor art of a brave Viking warrior with a horned helmet in a small boat on a white background. Realistic. bright colors.

    Page: Octopuses are amazing sea creatures with eight long arms called tentacles. They are very good at hiding because they can change color to blend in with their surroundings. Octopuses are smart animals that can open jars and puzzles! They move by pushing water out of their bodies, like a jet. Octopuses live in the ocean and they like to hide in caves and holes. They are great hunters and can catch fish and crabs with their tentacles.
    Image: watercolor clip art of an octopus hiding in an ocean cave.

    Page: ${page.text.content}
    Image:`

	const response = await generateText(prompt)

	console.log(response)

	return response
}
