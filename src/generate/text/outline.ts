import { Book, BookPages, Outline } from '@/types'
import StatusClass from '@/classes/Status'
import OutlineClass from '@/classes/Outline'
import PagesClass from '@/classes/Pages'
import { getFullBookDescription } from '@/util/book'
import generateText from './openai'

/**
 * @function generateOutline
 *
 * @summary
 * Should take a book and generate a new page structure for it.
 * 1) If the book has no pages, it should generate:
 *      - a new outline (which has just the status)
 *      - a new set of pages (call the page constructor)
 * 2) If the book has pages, it should:
 *      - check if a page is locked, if so keep it as it
 *      - if not, copy the page's content but generate a new chapter title for the page
 *
 * @param
 *
 * @returns
 *
 * @remarks
 */
async function generateOutline(book: Book): Promise<{
	outline: Outline
	pages: BookPages
}> {
	const newStatus = new StatusClass(book.outline.status)

	try {
		const newTitles = await getOutlineGPT(book)

		// Generate new pages from old pages and new chapter titles
		const pages = new PagesClass(newTitles, book.pages)

		// console.log(pages.toObject())

		// Create new outline object from the old outline
		const newOutline = new OutlineClass(book.outline)

		// Update status of the new outline
		newStatus.setAsSuccess()
		newOutline.setStatus(newStatus)

		// Return the new outline as an object
		return {
			outline: newOutline.toObject(),
			pages: pages.toObject(),
		}
	} catch (error: any) {
		// Update the status of the new outline
		newStatus.setError(
			error.message || 'Something went wrong generating the outline.'
		)
		newStatus.clearGenerating()

		// Return the old outline with a new status
		const newOutline = new OutlineClass(book.outline)
		newOutline.setStatus(newStatus)

		return {
			outline: newOutline.toObject(),
			pages: book.pages,
		}
	}
}

export default generateOutline

async function getOutlineGPT(book: Book) {
	const description = getFullBookDescription(book)
	const prompt = `Generate a list of chapters for a book with the title "${book.title}" and the following description: "${description}". Return the list as an array in JSON format. There should be 15 chapters. Here is an example for a book called 'Journey Through the Jungle':
    [
        Tigers, Monkeys, Elephants, Snakes, Parrots, Crocodiles, Butterflies, Ants, Leopards, Toucans, Frogs, Chameleons, Gorillas
    ]
    `

	const outlineJson = await generateText(prompt)

	const outline = JSON.parse(outlineJson)
	if (outline.length !== 15) {
		throw new Error('Outline is not the correct length')
	}
	return outline
}
