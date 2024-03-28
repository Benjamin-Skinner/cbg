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
	const prompt = `Generate a 140 word description for a children's book with the title '${book.title}'. The output should have three paragraphs, each separated by a newline character. Do not use character names. Basew the description on the following examples:
    
     Title: Journey Through the Jungle
    Description: Embark on an exhilarating journey into the heart of the jungle, a place brimming with life and color. This book is a gateway for young adventurers to explore a world filled with awe-inspiring sights. Each page is an invitation to uncover the secrets of this vibrant ecosystem.
    
    This captivating book brings the jungle's diverse inhabitants to life, from the smallest insects to the grandest animals that tread its paths. Readers will be enthralled by the rich tapestry of life under the dense canopy, presented through stunning illustrations and fascinating facts.
    
    Dive into the pages of this book and embark on an immersive journey through the jungle, where every step taken is an encounter with its daily marvels. This adventure beckons readers to uncover the hidden gems of this lush wilderness, promising a journey full of awe and discovery at every turn.
    
    Title: ${book.title}
    Description:`

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
	const prompt = `Generate a 100 word description for a children's book with the title '${book.title}'. The output should have two paragraphs, each separated by a newline character. Do not use character names. Basew the description on the following examples:
    
    Title: Journey Through the Jungle
    Description: Set off on a thrilling expedition into the jungle's heart, a realm teeming with vibrant life and colors. This book serves as a portal for young explorers to delve into a world of breathtaking sights and mysteries. Every page invites readers to discover the secrets of this dynamic ecosystem. 
    
    Experience the jungle's diverse life, from tiny insects to majestic animals, through vivid illustrations and intriguing facts. This journey through the jungle is an immersive experience, offering encounters with its daily wonders. It's an adventure that promises awe and discovery, revealing the hidden treasures of this lush wilderness. Uncover the jungle!
    
    Title: ${book.title}
    Description:`
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
