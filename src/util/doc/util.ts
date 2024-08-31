import * as fs from 'fs'
import { Document, Packer } from 'docx'
import { Book } from '@/types'
import { countWords } from '../wordCount'

export function saveDoc(doc: Document, filepath: string) {
	if (!process.env.DOCUMENT_DIR) {
		throw new Error('DOCUMENT_DIR env variable not set')
	}
	// Make sure the document dir exists, if not create it
	if (!fs.existsSync(process.env.DOCUMENT_DIR)) {
		fs.mkdirSync(process.env.DOCUMENT_DIR)
	}

	Packer.toBuffer(doc).then((buffer) => {
		fs.writeFileSync(filepath, buffer)
	})
}

export function bookName(title: string, version: string) {
	let name = 'error'
	if (version === 'hardcover') {
		name = 'Hard'
	} else if (version === 'softcover') {
		name = 'Soft'
	}
	return `${replaceSpaceWithDash(title)}-${name}`
}

function replaceSpaceWithDash(str: string) {
	return str.replace(/\s/g, '-')
}

export function validateBook(book: Book) {
	let numFullPages = 0
	// Make sure all fullPages have an even index
	for (let i = 0; i < book.pages.chapters.length; i++) {
		let chapter = book.pages.chapters[i]

		// Make sure all fullPages have an even index
		if (chapter.image.ar.fullPage) {
			numFullPages++
			if ((i + 1) % 2 !== 0) {
				throw new Error(
					`Chapter ${chapter.title} is a full page but is not on an even index`
				)
			}
		}
	}

	if (numFullPages !== 2) {
		throw new Error('Please select exactly 2 full page images')
	}
}
