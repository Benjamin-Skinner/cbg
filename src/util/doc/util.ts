import * as fs from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import { Document, Packer } from 'docx'
import { Book } from '@/types'
import { countWords } from '../wordCount'

export async function saveDoc(doc: Document, filepath: string) {
	if (!process.env.DOCUMENT_DIR) {
		throw new Error('DOCUMENT_DIR env variable not set')
	}

	// Make sure the document dir exists, if not create it
	if (!existsSync(process.env.DOCUMENT_DIR)) {
		mkdirSync(process.env.DOCUMENT_DIR)
	}

	try {
		const buffer = await Packer.toBuffer(doc)
		await fs.writeFile(filepath, buffer)
	} catch (error: any) {
		throw new Error(`Failed to save document: ${error.message}`)
	}
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

export function replaceSpaceWithDash(str: string) {
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
