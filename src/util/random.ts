import { NUM_CHAPTERS } from '@/constants'
import { Book } from '@/types'
import random from 'random'

export function randomPageNumber() {
	return random.int(1, NUM_CHAPTERS)
}

export function getRandomChapterTitles(book: Book, number: number) {
	const chapters = book.pages.chapters
	const chapterTitles = []

	for (let i = 0; i < number; i++) {
		const chapterNumber = random.int(1, chapters.length)
		const chapter = chapters[chapterNumber - 1]
		chapterTitles.push(chapter.title)
	}

	return chapterTitles
}
