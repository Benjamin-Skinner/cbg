import { Cover, Book } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'

async function generateBackCoverPrompt(book: Book): Promise<Cover> {
	const newStatus = new StatusClass(book.backCover.image.prompt.status)
	newStatus.beginGenerating()

	try {
		const response = await generateBackCoverPromptGPT(book)
		const newPrompt = `watercolor ${response}`
		newStatus.setAsSuccess()
		return {
			...book.backCover,
			image: {
				...book.backCover.image,
				prompt: {
					status: newStatus.toObject(),
					content: newPrompt,
				},
			},
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		return {
			...book.backCover,
			image: {
				...book.backCover.image,
				prompt: {
					...book.backCover.image.prompt,
					status: newStatus.toObject(),
				},
			},
		}
	}
}

async function generateBackCoverPromptGPT(book: Book): Promise<string> {
	const prompt = `Generate a description of a back cover image for a children's book called ${book.title}.
    The description should be one short sentence. There should be only one subject.
    Base it closely on the following examples:
    
    Book: Let's Discover California
    Description: image of the California coast with seaside bluffs

    Book: Ocean Odyssey
    Description: image of different fish swimming in the ocean

    Book: ${book.title}
    Description:`

	const response = await generateText(prompt)
	return response
}

export default generateBackCoverPrompt
