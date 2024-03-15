import { BookPages, ImageOption } from '@/types'
import PageClass from './Page'

class BookPagesClass {
	chapters: PageClass[]
	intro: PageClass
	conclusion: PageClass

	constructor(pages: BookPages) {
		this.intro = PageClass.fromObject(pages.intro)
		this.conclusion = PageClass.fromObject(pages.conclusion)
		this.chapters = pages.chapters.map((chapter) =>
			PageClass.fromObject(chapter)
		)
	}

	addImageOption(option: ImageOption, pageKey: string) {
		const page = this.getPage(pageKey)
		if (page) page.addImageOption(option)
	}

	removeImageOption(imageId: string, pageKey: string) {
		const page = this.getPage(pageKey)
		if (page) page.removeImageOption(imageId)
	}

	getPage(key: string) {
		if (this.intro.key === key) return this.intro
		if (this.conclusion.key === key) return this.conclusion
		return this.chapters.find((chapter) => chapter.key === key)
	}

	toObject(): BookPages {
		return {
			intro: this.intro.toObject(),
			conclusion: this.conclusion.toObject(),
			chapters: this.chapters.map((chapter) => chapter.toObject()),
		}
	}
}

export default BookPagesClass
