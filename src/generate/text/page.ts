import { Page, Book } from '@/types'
import StatusClass from '@/classes/Status'

async function generatePageText(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
): Promise<Page> {
	const newStatus = new StatusClass(page.text.status)
	try {
		const newPageText = await getPageText(page, book, intro, conclusion)
		console.log(newPageText)
		newStatus.setAsSuccess()
		return {
			...page,
			text: {
				content: newPageText,
				status: newStatus.toObject(),
			},
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		return {
			...page,
			text: {
				...page.text,
				status: newStatus.toObject(),
			},
		}
	}
}

export default generatePageText

async function getPageText(
	page: Page,
	book: Book,
	intro: boolean,
	conclusion: boolean
): Promise<string> {
	if (intro) {
		return getIntroText(page, book)
	}
	if (conclusion) {
		return getConclusionText(page, book)
	}
	return getChapterText(page, book)
}

async function getChapterText(page: Page, book: Book): Promise<string> {
	return `This is the text for the page ${page.title} in the book ${book.title}!`
}

async function getIntroText(page: Page, book: Book): Promise<string> {
	return `[INTRO] Introduction for the book called ${book.title}!`
}

async function getConclusionText(page: Page, book: Book): Promise<string> {
	return `[CONCLUSION] Conclusion for the book called ${book.title}!`
}
