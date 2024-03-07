import { Book, RandR } from '@/types'
import StatusClass from '@/classes/Status'
import { v4 as uuid } from 'uuid'

async function generateReflect(book: Book): Promise<RandR> {
	const newStatus = new StatusClass(book.reflect.status)

	try {
		// throw new Error('Something got fucked up here')
		newStatus.clearGenerating()
		newStatus.setAsSuccess()
		// Add the new questions to the old questions
		const newReflectQs: RandR = {
			status: newStatus.toObject(),
			activePages: [],
			questions: [
				...book.reflect.questions,
				{
					id: uuid(),
					page: '4',
					selected: false,
					text: 'If you were a parrot, what color would you be?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '11',
					selected: false,
					text: 'If you had teeth like a lion, would you eat children?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '3',
					selected: false,
					text: 'If you were as large as a hippopatamus, what diet would you go on?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '8',
					selected: false,
					text: 'If you needed to make friends with an animal, how would you do it?',
					fromPage: true,
				},
				{
					id: uuid(),
					page: '9',
					selected: false,
					text: 'What is your favorite animal and why?',
					fromPage: true,
				},
			],
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
