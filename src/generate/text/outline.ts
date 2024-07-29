import { Book, BookPages, Outline, Page } from '@/types'
import StatusClass from '@/classes/Status'
import OutlineClass from '@/classes/Outline'
import generateText from './openai'
import { NUM_CHAPTERS } from '@/constants'

/**
 * @function generateOutline
 *
 * @summary
 *
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
		// Get pages for book based on new outline
		const newPages = await getNewPages(book)

		// Update status of the new outline
		newStatus.setAsSuccess()

		// Return the new outline as an object
		return {
			outline: {
				status: newStatus.toObject(),
			},
			pages: newPages,
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

async function getNewPages(book: Book): Promise<BookPages> {
	let newChapterTitles = []

	const numLockedChapters = book.pages.chapters.filter(
		(chapter) => chapter.subjectLocked
	).length

	if (numLockedChapters === NUM_CHAPTERS) {
		console.log('All chapters are locked')
		return book.pages
	}
	if (numLockedChapters > 0) {
		// Generate outline with locked chapters
		newChapterTitles = await generateOutlineWithCurrentChapters(book)
	} else {
		// Generate outline with no locked chapters
		newChapterTitles = await generateNewOutline(book)
	}

	console.log('The new chapter titles are:')
	console.log(newChapterTitles)
	const newBookChapters: Page[] = []

	for (let i = 0; i < newChapterTitles.length; i++) {
		const newPage = { ...book.pages.chapters[i] }
		newPage.title = newChapterTitles[i]
		newBookChapters.push(newPage)
	}

	if (newBookChapters.length !== NUM_CHAPTERS) {
		throw new Error(
			'After processing, there is an incorrect number of chapters in the book'
		)
	}

	return {
		intro: book.pages.intro,
		conclusion: book.pages.conclusion,
		chapters: newBookChapters,
	}
}

/**
 * @function generateNewOutline
 *
 * @summary
 * Generates an outline for a book with no locked chapter titles
 *
 * @param book - The book to generate an outline for
 *
 * @returns The generated outline as an array of chapter titles
 *
 * @remarks We only base this outline on the title and the oneLiner
 */
async function generateNewOutline(book: Book): Promise<string[]> {
	const prompt = `Generate a list of chapters for a book with the title "${book.title}" and the following description: "${book.oneLiner}". Return the list as an array in JSON format. There should be ${NUM_CHAPTERS} chapters. Each chapter should have a specific noun as the title, and should be one to three words. Topics must not repeat. Base the chapters on the following examples:
    Title: Journey Through the Jungle
    description: Embark on an exciting adventure in 'Journey Through the Jungle'! This vibrant children's book takes young explorers through the lush, green world of the jungle, introducing them to exotic animals, hidden treasures, and the wonders of nature.
    chapters: ["Tigers", "Monkeys", "Elephants", "Snakes", "Parrots", "Crocodiles", "Butterflies", "Ants", "Leopards", "Toucans", "Frogs", "Chameleons", "Gorillas"]

    Title: Wonders of the World
    description: Explore the magnificent marvels of our planet in 'Wonders of the World'! This captivating children's book guides young readers on a journey to discover the most incredible natural and man-made wonders, from the Great Wall of China to the Grand Canyon, sparking curiosity and a sense of adventure.
    chapters: ["Pyramids", "Great Wall", "Taj Mahal", "Eiffel Tower", "Colosseum", "Machu Picchu", "Great Barrier Reef", "Northern Lights", "Mount Everest", "Amazon Rainforest", "Parthenon", "Grand Canyon", "Hagia Sophia"]

    Title: Adventures in History
    description: Step back in time with 'Adventures in History'! This engaging children's book invites young readers to explore significant events and remarkable figures from the past. From ancient civilizations to pivotal moments in history, each page offers a captivating glimpse into the stories that have shaped our world.
    chapters: ["Egyptian Pharoahs", "Ancient Greece", "Roman Empire", "Incan Empire", "Medieval Castles", "Vikings", "Samurai", "Pirates", "Renaissance", "American Colonies", "Pioneers", "Jazz Age", "Space Race"]
    
    Title: ${book.title}
    description: ${book.oneLiner}
    chapters:`

	const outlineJson = await generateText(prompt)

	const outline = JSON.parse(outlineJson)
	if (outline.length !== NUM_CHAPTERS) {
		throw new Error(
			'Generated outline is not the correct length. Please try again'
		)
	}
	return outline
}

/**
 * @function generateOutlineWithCurrentChapters
 *
 * @summary
 * Given a set of locked chapters, will generate new titles for the remaining chapters
 *
 * @param book - The book to generate an outline for
 *
 * @returns The generated outline as an array of chapter titles
 *
 * @remarks
 */

async function generateOutlineWithCurrentChapters(
	book: Book
): Promise<string[]> {
	const lockedChapters = book.pages.chapters.filter(
		(chapter) => chapter.subjectLocked
	)

	const numChaptersToGenerate = NUM_CHAPTERS - lockedChapters.length

	const prompt = `Given the title of an educational children's book, a description of the book, and a list of chapter titles, generate more unique chapter titles. Each one must be different than any of the current chapters. For example, if the Current Chapters array has a chapter called 'Dragonflies', the New Chapters array must not have a chapter called 'Dragonflies'. Return the list as an array in JSON format. Only include the new chapters in your output. Follow the example:
Title: Journey Through the Jungle
Number of New Chapters: 3
Description: Embark on an exciting adventure in 'Journey Through the Jungle'! This vibrant children's book takes young explorers through the lush, green world of the jungle, introducing them to exotic animals, hidden treasures, and the wonders of nature.
Current Chapters: Tigers, Monkeys, Elephants, Snakes, Parrots, Crocodiles, Butterflies, Ants, Leopards, Toucans
New Chapters: ["Gorillas, "Frogs", "Chameleons"]

Title: Wonders of the World
Number of New Chapters: 1
Description: Explore the magnificent marvels of our planet in 'Wonders of the World'! This captivating children's book guides young readers on a journey to discover the most incredible natural and man-made wonders, from the Great Wall of China to the Grand Canyon, sparking curiosity and a sense of adventure.
Current Chapters: Pyramids, Great Wall, Taj Mahal, Eiffel Tower, Colosseum, Machu Picchu, Great Barrier Reef, Northern Lights, Mount Everest, Amazon Rainforest, Stonehenge, Victoria Falls
New Chapters: ["Petra"]

Title: ${book.title}
Number of New Chapters: ${numChaptersToGenerate}
Description: ${book.oneLiner}
Current Chapters: ${book.pages.chapters.map((item) => item.title).join(', ')}
New Chapters:`

	const newChaptersJSON = await generateText(prompt)
	const newChapters: string[] = JSON.parse(newChaptersJSON)

	// Check that we generated the right number of chapters
	if (newChapters.length !== numChaptersToGenerate) {
		throw new Error(
			`Generated outline is not the correct length. Expected ${numChaptersToGenerate} chapters, but got ${newChapters.length}`
		)
	}

	// Go through each chapter; if it is not locked, replace it's title with one of the new ones
	const newTitles: string[] = []

	for (let i = 0; i < book.pages.chapters.length; i++) {
		if (book.pages.chapters[i].subjectLocked) {
			newTitles.push(book.pages.chapters[i].title)
		} else {
			const newChapterTitle = newChapters.shift()
			if (!newChapterTitle) {
				throw new Error('Not enough new chapters generated')
			}
			newTitles.push(newChapterTitle)
		}
	}

	return newTitles
}
