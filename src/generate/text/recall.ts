import { Book, RandR } from '@/types'
import StatusClass from '@/classes/Status'
import { v4 as uuid } from 'uuid'

async function generateRecall(book: Book): Promise<RandR> {
	const newStatus = new StatusClass(book.outline.status)

	try {
		// throw new Error('Something got fucked up here')
		newStatus.clearGenerating()
		newStatus.setAsSuccess()
		// Add the new questions to the old questions
		const newRecallQs: RandR = {
			status: newStatus.toObject(),
			activePages: [],
			questions: [
				...book.recall.questions,
				{
					id: uuid(),
					page: '4',
					selected: false,
					text: 'What can parrots do that people can also do?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '11',
					selected: false,
					text: 'Where do leopards like to sleep during the day?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '3',
					selected: false,
					text: "If you could touch a crocodile's skin, what would it feel like?",
					fromPage: true,
				},
				{
					id: uuid(),
					page: '8',
					selected: false,
					text: 'What do butterflies like to drink?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '9',
					selected: false,
					text: 'What body part do frogs use to catch their food?',
					fromPage: true,
				},
			],
		}

		// Return the new outline as an object
		return newRecallQs
	} catch (error: any) {
		// Update the status of the new outline
		newStatus.setError(
			error.message || 'Something went wrong generating the outline.'
		)
		newStatus.clearGenerating()

		const newRecall = {
			...book.recall,
			status: newStatus.toObject(),
		}

		// Return the old outline with a new status
		return newRecall
	}
}

export default generateRecall
