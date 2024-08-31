import { Book, Question, RandR } from '@/types'
import StatusClass from '@/classes/Status'
import { v4 as uuid } from 'uuid'
import { randomPageNumber } from '@/util/random'
import generateText from './openai'

const NUM_QUESTIONS = 5
async function generateRecall(book: Book): Promise<RandR> {
	const newStatus = new StatusClass(book.recallAndReflect.recall.status)

	try {
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
			questions: [
				...book.recallAndReflect.recall.questions,
				...newQuestions,
			],
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
			...book.recallAndReflect.recall,
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

    Page: Mom pointed to a new spot on the map and said, "That's San Diego!" San Diego is a sunny city by the ocean. It has beautiful beaches, where you can play in the sand and surf in the waves. San Diego has a famous zoo with animals from all around the world. The city is full of fun things to do, such as visit museums and eat delicious food.
    Question: What activities can you do in San Diego?


    Page: As Jack and Emma looked at the map, Mom showed them a place called Silicon Valley. Silicon Valley is a special place where many smart people work on amazing inventions. It's a big playground for science and technology! Google, Apple, and Facebook all started in Silicon Valley. They make websites and technology that are used by people from all over the world. Silicon Valley is an exciting place to work!
    Question: What do people do in Silicon Valley?

    Page: Now Emma and Jack looked at Napa Valley. Napa Valley is a special place in California known for its vineyards and wineries. Rows of grapevines grow there to make wine. The weather in Napa Valley is perfect for growing grapes, not too hot and not too cold. "Did you know that Napa Valley has over 400 wineries?" asked Mom. "That's a lot of grapes!" said Jack.
    Question: Why is Napa Valley perfect for growing delicious grapes?

    Page: "California is also home to Redwood trees" Mom said with a smile. Redwoods are the tallest trees on Earth. They have thick bark to protect them from fires. Redwoods can grow as tall as a 30-story building. Some redwood trees are over 2,000 years old. Redwood forests are quiet places with many different animals. These trees help clean the air, provide homes for creatures, and create a peaceful environment. 
    Question: What do you call the really tall trees that live in Northern California?

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
