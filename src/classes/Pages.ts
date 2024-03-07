import PageClass from './Page'
import { BookPages, Page } from '@/types'

class PagesClass {
	chapters: PageClass[]
	intro: Page
	conclusion: Page

	// Given a list of titles, create a new PagesClass -> used for the first generation
	constructor(titles: string[], oldPages: BookPages) {
		if (titles.length !== 15) throw new Error('There must be 15 chapters')
		this.intro = oldPages.intro
		this.conclusion = oldPages.conclusion

		const newChapters: PageClass[] = []
		for (let i = 0; i < titles.length; i++) {
			const newPage = PageClass.fromObject(oldPages.chapters[i])
			// check if page is locked
			if (!oldPages.chapters[i].subjectLocked) {
				// If the chapter is not locked, we need to set the new title
				newPage.setTitle(titles[i])
			}

			newChapters.push(newPage)
		}

		// For each chapter, we want to copy the old page but just change the title
		this.chapters = newChapters
	}

	toObject(): BookPages {
		return {
			intro: this.intro,
			conclusion: this.conclusion,
			chapters: this.chapters.map((chapter) => chapter.toObject()),
		}
	}
}

export default PagesClass
