import StatusClass from '@/classes/Status'
import generateText from './openai'

import {
	Book,
	Description,
	HardcoverDescription,
	SoftcoverDescription,
} from '@/types'

/**
 * @function generateDescription
 *
 * @summary
 * Generates either the hardcover or softcover description for a book.
 *
 * @param book - The book to generate the description for
 * @param type - The type of description to generate
 *
 * @returns The entire description object, including the updated status
 *
 * @remarks
 */
async function generateDescription(
	book: Book,
	type: 'hardcover' | 'softcover'
): Promise<Description> {
	// Handle status
	const newStatus = new StatusClass(book.description.status)

	if (type === 'hardcover') {
		try {
			await generateHardcoverDescription(book)
			newStatus.setAsSuccess()
			return {
				...book.description,
				hardcover: await generateHardcoverDescription(book),
				status: newStatus.toObject(),
			}
		} catch (error: any) {
			newStatus.setError(error.message)
			newStatus.clearGenerating()
			return {
				...book.description,
				status: newStatus.toObject(),
			}
		}
	} else {
		try {
			await generateSoftcoverDescription(book)
			newStatus.setAsSuccess()
			return {
				...book.description,
				softcover: await generateSoftcoverDescription(book),
				status: newStatus.toObject(),
			}
		} catch (error: any) {
			newStatus.setError(error.message)
			newStatus.clearGenerating()
			return {
				...book.description,
				status: newStatus.toObject(),
			}
		}
	}
}

export default generateDescription

async function generateHardcoverDescription(
	book: Book
): Promise<HardcoverDescription> {
	// Generate the description
	const prompt = `Generate a 140 word description for a children's book with the title '${book.title}'. The output should have three paragraphs, each separated by a newline character.`
	const description = await generateText(prompt)

	let paragraphs = description.split('\n')
	paragraphs = paragraphs.filter((p) => p.length > 0)

	if (paragraphs.length !== 3) {
		throw new Error(
			'Description was generated with incorrect number of paragraphs'
		)
	}

	return {
		first: paragraphs[0],
		second: paragraphs[1],
		third: paragraphs[2],
	}
}

async function generateSoftcoverDescription(
	book: Book
): Promise<SoftcoverDescription> {
	// Generate the description
	const prompt = `Generate a 100 word description for a children's book with the title '${book.title}'. The output should have two paragraphs, each separated by a newline character.`
	const description = await generateText(prompt)

	let paragraphs = description.split('\n')
	paragraphs = paragraphs.filter((p) => p.length > 0)

	// There should be two paragraphs
	if (paragraphs.length !== 2) {
		throw new Error(
			'Description was generated with incorrect number of paragraphs'
		)
	}

	return {
		first: paragraphs[0],
		second: paragraphs[1],
	}
}
