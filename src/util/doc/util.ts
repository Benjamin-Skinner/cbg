import * as fs from 'fs'
import { Document, Packer } from 'docx'

export function saveDoc(doc: Document, filepath: string) {
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
