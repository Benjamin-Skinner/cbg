import * as fs from 'fs'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { Book } from '@/types'

export async function generateDoc(book: Book, version: string) {
	const doc = new Document({
		sections: [
			{
				properties: {},
				children: [
					new Paragraph({
						children: [
							new TextRun('Hello World'),
							new TextRun({
								text: 'Foo Bar',
								bold: true,
							}),
							new TextRun({
								text: '\tGithub is the best',
								bold: true,
							}),
						],
					}),
				],
			},
		],
	})

	saveDoc(doc, bookName(book.title, version))
}

export function saveDoc(doc: Document, name: string) {
	Packer.toBuffer(doc).then((buffer) => {
		fs.writeFileSync(`/Users/Benskinner/Code/cbg/docs/${name}.docx`, buffer)
	})
}

export function bookName(title: string, version: string) {
	return `${title}-${version}`
}
