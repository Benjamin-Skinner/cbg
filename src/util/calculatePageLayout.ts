import { PageLayoutOption, Page, Book } from '@/types'

export function calculatePageLayout(
	index: number,
	fullPages: number[]
): PageLayoutOption {
	// Check if the page is a full page
	if (fullPages.includes(index)) {
		return 'fullPage'
	}

	// Calculate the effective index by skipping full pages
	let effectiveIndex = 0
	for (let i = 0; i < index; i++) {
		if (!fullPages.includes(i)) {
			effectiveIndex++
		}
	}

	// Determine the type based on the effective index
	return effectiveIndex % 2 === 0 ? 'textFirst' : 'imageFirst'
}

export const getNewPageLayouts = (book: Book) => {
	console.log('updatePageLayouts')
	// Determine which page indexes are full pages
	const fullPageKeys = book.pages.chapters
		.filter((page, index) => page.layout === 'fullPage')
		.map((page) => page.key)
	const fullPageIndexes: number[] = []

	// Get the indexes of the full pages
	for (let i = 0; i < book.pages.chapters.length; i++) {
		if (fullPageKeys.includes(book.pages.chapters[i].key)) {
			fullPageIndexes.push(i)
		}
	}

	// Create a new array of pages
	const newPages: Page[] = []
	for (let i = 0; i < book.pages.chapters.length; i++) {
		const newLayout = calculatePageLayout(i, fullPageIndexes)
		newPages.push({ ...book.pages.chapters[i], layout: newLayout })
	}

	return newPages
}
