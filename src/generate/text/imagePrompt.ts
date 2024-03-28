import { Page, Book } from '@/types'
import StatusClass from '@/classes/Status'
import { sleep } from 'openai/core.mjs'

async function generateImagePrompt(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
): Promise<Page> {
	const newStatus = new StatusClass(page.image.status)
	try {
		const newPrompt = await getMidjourneyPrompt(page, book)
		console.log(newPrompt)
		newStatus.setAsSuccess()
		return {
			...page,
			image: {
				...page.image,
				prompt: newPrompt,
				status: newStatus.toObject(),
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
				status: newStatus.toObject(),
			},
		}
	}
}

export default generateImagePrompt

// TODO: Chaos param
async function getMidjourneyPrompt(page: Page, book: Book) {
	const prompt = `watercolor clip art of ${page.title.toLowerCase()} on a white background, hyperrealistic. Nature. Natural`
	return prompt
}
