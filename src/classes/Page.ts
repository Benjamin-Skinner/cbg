import StatusClass from './Status'
import { ImageOption, Page, ImageOptionGenerating } from '@/types'
import { extractPngName } from '@/util/url'
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
	layout: Page['layout']
	text: {
		status: StatusClass
		content: string
	}
	image: {
		status: StatusClass
		image: string
		imageOptions: ImageOption[]
		generatingImages: ImageOptionGenerating[]
		prompt: {
			status: StatusClass
			content: string
		}
	}

	constructor(title: string, currPosition: number) {
		this.title = title
		this.currPosition = currPosition

		this.layout = 'imageFirst'

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
			generatingImages: [],
			prompt: {
				status: new StatusClass(),
				content: '',
			},
		}
	}

	addImageOption(option: ImageOption) {
		this.image.imageOptions.push(option)
	}

	removeImageOption(imageId: string) {
		const imageName = extractPngName(imageId)
		this.image.imageOptions = this.image.imageOptions.filter(
			(option) => extractPngName(option.url) !== imageName
		)
	}

	setTitle(title: string) {
		this.title = title
	}

	toObject(): Page {
		return {
			title: this.title,
			layout: this.layout,
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
				generatingImages: this.image.generatingImages,
				prompt: {
					status: this.image.prompt.status.toObject(),
					content: this.image.prompt.content,
				},
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
			generatingImages: page.image.generatingImages,
			prompt: {
				status: new StatusClass(page.image.prompt.status),
				content: page.image.prompt.content,
			},
		}
		return newPage
	}
}

export default PageClass
