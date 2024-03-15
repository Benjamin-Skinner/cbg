import { Book, RandR, Question } from '@/types'
import StatusClass from '@/classes/Status'
import { v4 as uuid } from 'uuid'
import generateText from './openai'
import { randomPageNumber } from '@/util/random'

const NUM_QUESTIONS = 5
async function generateReflect(book: Book): Promise<RandR> {
	const newStatus = new StatusClass(book.reflect.status)

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
		const newReflectQs: RandR = {
			status: newStatus.toObject(),
			activePages: [],
			questions: [...book.reflect.questions, ...newQuestions],
		}

		// Return the new outline as an object
		return newReflectQs
	} catch (error: any) {
		// Update the status of the new outline
		newStatus.setError(
			error.message ||
				'Something went wrong generating the reflect questions.'
		)
		newStatus.clearGenerating()

		const newReflect = {
			...book.reflect,
			status: newStatus.toObject(),
		}

		// Return the old outline with a new status
		return newReflect
	}
}

export default generateReflect

async function generateOneQuestion(book: Book) {
	const pageNum = randomPageNumber()
	const page = book.pages.chapters[pageNum - 1]

	// If the page has no content, throw error
	if (page.text.content.length < 2) {
		throw new Error('Please ensure there are no empty pages in the book.')
	}

	const prompt = `
    Based on the page, ask an open-ended discussion question for children in 10 words. Each question should be exciting and help engage creativity. Each question should engage the reasoning and emotional skills of the reader. Closely follow the examples.

    Page: Elephants are the largest land animals. They are so big, they could carry two cars on their back! They have long, strong trunks and big, floppy ears. An elephant uses its trunk for many different things. It helps them to pick up things, smell, and even drink water. Elephants love to splash and play in the water. They live together in groups and are very caring towards each other.
    Question: If you could have a trunk like an elephant, what would you use it for?

    Page: The Northern Lights, also known as Aurora Borealis, are a magical light show in the sky. These lights can be seen in the very north parts of the world. When charged particles from the sun hit our atmosphere, they light up, creating beautiful colors. Imagine seeing ribbons of green, blue, purple and even pink dancing across the sky! It's like a giant artwork in the heavens. The Northern Lights are a breathtaking spectacle of nature.
    Question: If you could paint the sky with the Northern Lights, what colors and patterns would you choose?

    Page: Mount Everest is the highest mountain in the world, located in Asia. Reaching the top is like touching the sky! It's so high, it's often hidden in the clouds. Climbing Everest is hard and dangerous, but some brave people still do it for the amazing view from the top. The mountain is covered with ice and snow all year round. It's a stunning, majestic peak that truly showcases the grandeur of our planet.
    Question: Pretend you're climbing Mount Everest. What challenges would you face?

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
