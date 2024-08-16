import { Book, Page } from '@/types'

function getPageFromKey(book: Book, key: string): Page {
	if (key === 'intro') {
		return book.pages.intro
	} else if (key === 'conclusion') {
		return book.pages.conclusion
	} else {
		const page = book.pages.chapters.find((page) => page.key === key)
		if (page) {
			return page
		} else {
			throw new Error('Page not found')
		}
	}
}

export default getPageFromKey

export function getPageIndexInChapters(book: Book, key: string): string {
	const index = book.pages.chapters.findIndex((page) => page.key === key)
	if (index === -1) {
		throw new Error('Page not found')
	}
	return index.toString()
}
