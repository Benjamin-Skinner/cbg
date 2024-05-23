import { Book, Question, RandR } from '@/types'
import StatusClass from '@/classes/Status'
import { v4 as uuid } from 'uuid'
import { randomPageNumber } from '@/util/random'
import generateText from './openai'

const NUM_QUESTIONS = 5
async function generateRecall(book: Book): Promise<RandR> {
	const newStatus = new StatusClass(book.recall.status)

	try {
		// throw new Error('Something got fucked up here')
		newStatus.clearGenerating()
		newStatus.setAsSuccess()

		const newQuestions: Question[] = []
		for (let i = 0; i < NUM_QUESTIONS; i++) {
			const { question, pageNum } = await generateOneQuestion(book)
			newQuestions.push({
				id: uuid(),
				page: pageNum.toString(),
				selected: false,
				text: question,
				fromPage: true,
			})
		}

		// Add the new questions to the old questions
		const newRecallQs: RandR = {
			status: newStatus.toObject(),
			activePages: [],
			questions: [...book.recall.questions, ...newQuestions],
		}

		// Return the new questions as an object
		return newRecallQs
	} catch (error: any) {
		// Update the status of the new questions
		newStatus.setError(
			error.message ||
				'Something went wrong generating the recall questions'
		)
		newStatus.clearGenerating()

		const newRecall = {
			...book.recall,
			status: newStatus.toObject(),
		}

		// Return the old questions with a new status
		return newRecall
	}
}

export default generateRecall

async function generateOneQuestion(book: Book) {
	const pageNum = randomPageNumber()
	console.log('pageNum', pageNum)
	const page = book.pages.chapters[pageNum - 1]

	// If the page has no content, throw error
	if (page.text.content.length < 2) {
		throw new Error('Please ensure there are no empty pages in the book.')
	}

	const prompt = `
    Based on the page, ask a specific question about the content in 12 words. Closely follow the examples below.
    
    Page: The Eiffel Tower is a big metal tower in Paris, France. It's taller than a stack of 81 cars! Built in 1889, it was the tallest thing people had ever made back then. The tower has three floors where people can look out and see the city. At night, it sparkles with lots of tiny lights. It's named after Gustave Eiffel, who thought up the design. Every year, millions of people come to see this special tower.
    Question: What does the Eiffel Tower look like at night?

    Page: The Northern Lights, also known as Aurora Borealis, are a magical light show in the sky. These lights can be seen in the very north parts of the world. When charged particles from the sun hit our atmosphere, they light up, creating beautiful colors. Imagine seeing ribbons of green, blue, purple and even pink dancing across the sky! It's like a giant artwork in the heavens. The Northern Lights are a breathtaking spectacle of nature.
    Question: What colors can you see in the Northern Lights?

    Page: Butterflies are beautiful insects that live in the jungle. They start as tiny eggs, then hatch into caterpillars. These caterpillars munch on leaves. After a while, they wrap themselves in a cozy blanket called a chrysalis, just like you snuggle in your blanket at night. Inside, they transform into beautiful butterflies with colorful wings. Butterflies flutter from flower to flower, sipping nectar like a straw in a sweet drink.
    Question: What do butterflies like to drink?

    Page: ${page.text.content}
    Question:`

	const question = await generateText(prompt)

	if (!question) {
		throw new Error('Failed to generate question')
	}

	return {
		question,
		pageNum,
	}
}
