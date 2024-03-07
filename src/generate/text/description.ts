import StatusClass from '@/classes/Status'

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
	const firstDescription =
		"Embark on a globe-trotting adventure with Wonders of the World, a captivating children's book that showcases the most extraordinary natural and human-made marvels across the globe. This enchanting journey hellps young readers appreciate the incredible diversity and beauty of our planet. "

	const secondDescription =
		'Each page bursts with vibrant illustrations and engaging facts about these awe-inspiring wonders. Discover the towering peaks of the Himalayas, the ancient mysteries of Stonehenge, and the architectural splendors of the Roman Colosseum. Learn about the cultural, historical, and geographical significance of each wonder, from the Great Wall of China to the serene beauty of the Taj Mahal.!'

	const thirdDescription =
		'This book not only educates but also inspires a deep appreciation for the remarkable achievements of both nature and humankind. Prepare to be amazed and embark on an unforgettable journey through the Wonders of the World!'

	return {
		first: firstDescription,
		second: secondDescription,
		third: thirdDescription,
	}
}

async function generateSoftcoverDescription(
	book: Book
): Promise<SoftcoverDescription> {
	const firstDescription =
		"SOFTCOVER Embark on a globe-trotting adventure with Wonders of the World, a captivating children's book that showcases"

	const secondDescription =
		'SOFTCOVER Embark on a globe-trotting adventure witrk on an unforgettable, SOFTCOVER Embark on a globe-trotting adventure witrk on an unforgettable, SOFTCOVER Embark on a globe-trotting adventure witrk on an unforgettable'

	return {
		first: firstDescription,
		second: secondDescription,
	}
}
