import StatusClass from './Status'
import { ImageOption, Page } from '@/types'
import { v4 as uuid } from 'uuid'

/*
 *
 * PageClass
 * Represents a page of the book; text and images
 */

class PageClass {
	title: string
	currPosition: number
	subjectLocked: boolean
	key: string
	text: {
		status: StatusClass
		content: string
	}
	image: {
		status: StatusClass
		image: string
		imageOptions: ImageOption[]
		prompt: string
	}

	constructor(title: string, currPosition: number) {
		this.title = title
		this.currPosition = currPosition

		const textStatus = new StatusClass()
		const imageStatus = new StatusClass()
		this.subjectLocked = false

		this.key = uuid()

		this.text = {
			status: textStatus,
			content: '',
		}

		this.image = {
			status: imageStatus,
			image: '',
			imageOptions: [],
			prompt: '',
		}
	}

	addImageOption(option: ImageOption) {
		this.image.imageOptions.push(option)
	}

	removeImageOption(imageId: string) {
		this.image.imageOptions = this.image.imageOptions.filter(
			(option) => option.url !== imageId
		)
	}

	setTitle(title: string) {
		this.title = title
	}

	toObject(): Page {
		return {
			title: this.title,
			currPosition: this.currPosition,
			subjectLocked: this.subjectLocked,
			key: this.key,
			text: {
				status: this.text.status.toObject(),
				content: this.text.content,
			},
			image: {
				status: this.image.status.toObject(),
				image: this.image.image,
				imageOptions: this.image.imageOptions,
				prompt: this.image.prompt,
			},
		}
	}

	setKey(key: string) {
		this.key = key
	}

	// Take an object and return an identical PageClass
	static fromObject(page: Page) {
		const newPage = new PageClass(page.title, page.currPosition)
		newPage.setKey(page.key)
		newPage.subjectLocked = page.subjectLocked
		newPage.text = {
			status: new StatusClass(page.text.status),
			content: page.text.content,
		}
		newPage.image = {
			status: new StatusClass(page.image.status),
			image: page.image.image,
			imageOptions: page.image.imageOptions,
			prompt: page.image.prompt,
		}
		return newPage
	}
}

export default PageClass
