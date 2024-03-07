import { Book, BookPages, Outline } from '@/types'
import StatusClass from '@/classes/Status'
import OutlineClass from '@/classes/Outline'
import AllPagesClass from '@/classes/AllPages'
import PagesClass from '@/classes/Pages'

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
		const newTitles = [
			'First Chapter',
			'Pandas',
			'JAGUARS',
			'pigs',
			'pigs',
			'Parrots',
			'Snakes',
			'Gorillas',
			'Monkeys',
			'Cheetahs',
			'Leopards',
			'Elephants',
			'Butterflies',
			'Crocodiles',
			'Ants',
		]

		// Generate new pages from old pages and new chapter titles
		const pages = new PagesClass(newTitles, book.pages)

		console.log(pages.toObject())

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
