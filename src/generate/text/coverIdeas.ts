import { Book, ImageIdea, ImageIdeas, Cover } from '@/types'
import StatusClass from '@/classes/Status'
import { getFullBookDescription } from '@/util/book'
import generateText from './openai'

export async function generateCoverIdeas(
	book: Book,
	cover: Cover,
	front: boolean,
	back: boolean
): Promise<ImageIdeas> {
	try {
		const newIdeas = await generateIdeas(book)

		const newStatus = new StatusClass(cover.imageIdeas.status)
		newStatus.clearGenerating()
		newStatus.setAsSuccess()

		const newImageIdea: ImageIdeas = {
			ideas: newIdeas,
			status: newStatus.toObject(),
		}

		return newImageIdea
	} catch (error: any) {
		const newStatus = new StatusClass(cover.imageIdeas.status)
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		const newImageIdea: ImageIdeas = {
			ideas: cover.imageIdeas.ideas,
			status: newStatus.toObject(),
		}

		return newImageIdea
	}
}

async function generateIdeas(book: Book): Promise<ImageIdea[]> {
	const prompt = `I will give you the title of a fact-based children's book and a description of that book. Give 4 ideas for a 2-10 word description of an engaging image for the front cover of the book. The image should depict a specific real-life subject. Do not include any humans. You must respond in JSON format, using the exact same format as the examples.
    Title: Ocean Odyssey
    Description: A fact-based children's book about the ocean and the creatures that live in it.
    Cover: ["Two dolphins playing in the water", "An octopus hiding in a cave", "A majestic whale jumping above the sea", "A colorful coral reef"]

    Title: The Great Outdoors
    Description: A fact-based children's book about the great outdoors and the animals that live there.
    Cover: ["A bear catching a fish in a river", "A deer grazing in a meadow", "A squirrel climbing a tree", "A bird building a nest"]

    Title: ${book.title}
    Description: ${getFullBookDescription(book)}
    Cover:`

	const response = await generateText(prompt, 1)
	const ideasArray = JSON.parse(response)
	const newIdeas: ImageIdea[] = ideasArray.map((idea: string) => {
		return {
			content: idea,
		}
	})

	return newIdeas
}
