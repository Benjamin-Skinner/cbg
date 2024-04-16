import * as fs from 'fs'
import {
	Document,
	Packer,
	Paragraph,
	ImageRun,
	PageBreak,
	AlignmentType,
	FrameAnchorType,
	TextRun,
	HorizontalPositionAlign,
	VerticalPositionAlign,
} from 'docx'
import { Book, Page, Question, RandR } from '@/types'
import { downloadMidjourneyImage } from './image'

export async function generateDoc(
	book: Book,
	version: string,
	filepath: string
) {
	const bulletImg = fs.readFileSync(
		'/Users/Benskinner/Code/cbg/src/assets/bullet.png'
	)

	const doc = new Document({
		sections: [
			// Start off with two blank pages
			blankPage(),
			blankPage(),

			// Add Intro
			await newPage(book.pages.intro, book),
			// Add Content
			await newPage(book.pages.chapters[0], book),
			await newPage(book.pages.chapters[1], book),
			await newPage(book.pages.chapters[2], book),
			await newPage(book.pages.chapters[3], book),
			await newPage(book.pages.chapters[4], book),
			await newPage(book.pages.chapters[5], book),
			await newPage(book.pages.chapters[6], book),
			await newPage(book.pages.chapters[7], book),
			await newPage(book.pages.chapters[8], book),
			await newPage(book.pages.chapters[9], book),
			await newPage(book.pages.chapters[10], book),
			await newPage(book.pages.chapters[11], book),
			await newPage(book.pages.chapters[12], book),

			// Add Conclusion
			await newPage(book.pages.conclusion, book),
			newRandR(book.recall.questions, bulletImg, 'Recall'),
			newRandR(book.reflect.questions, bulletImg, 'Reflect'),
		],
	})

	saveDoc(doc, filepath)
}

/**
 * *************** BOOK BUILDING ***************
 */

async function newPage(page: Page, book: Book) {
	console.log(`Downloading Image for Page ${page.title}`)
	const { imgPath } = await downloadMidjourneyImage(
		page.image.image,
		book,
		page.title
	)
	console.log(`Image downloaded to: ${imgPath}`)
	console.log(`Reading image buffer`)
	const imageBuffer = fs.readFileSync(imgPath)

	console.log(`Creating new page`)

	return {
		properties: {},
		children: [
			new Paragraph({
				children: [
					new ImageRun({
						data: imageBuffer,
						transformation: {
							width: 650,
							height: 650,
						},
						floating: {
							horizontalPosition: {
								offset: 754400,
							},
							verticalPosition: {
								offset: 254400,
							},
							margins: {
								top: 0,
								bottom: 0,
							},
						},
					}),
				],
				// alignment: AlignmentType.CENTER,
			}),
			new Paragraph({
				spacing: {
					line: 276,
				},
				alignment: AlignmentType.CENTER,
				children: [
					new TextRun({
						text: page.text.content,
						size: 32,
						font: 'VI Lam Anh',
						break: 18,
					}),
				],
			}),
			new Paragraph({
				children: [new PageBreak()],
			}),
		],
	}
}

function newRandR(
	questions: Question[],
	imageBuffer: Buffer,
	title: 'Recall' | 'Reflect'
) {
	const bookImage = fs.readFileSync(
		'/Users/Benskinner/Code/cbg/src/assets/books.png'
	)

	return {
		children: [
			new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [
					new TextRun({
						text: title,
						size: 62,
						font: 'Comfortaa',
						color: '#1C1C53',
						break: 1,
					}),
				],
			}),
			newQuestion(questions, 0, imageBuffer),
			newQuestion(questions, 1, imageBuffer),
			newQuestion(questions, 2, imageBuffer),
			newQuestion(questions, 3, imageBuffer),
			newQuestion(questions, 4, imageBuffer),
			new Paragraph({
				children: [
					new ImageRun({
						data: bookImage,
						transformation: {
							width: 1000,
							height: 132,
						},
						floating: {
							horizontalPosition: {
								offset: 0,
							},
							verticalPosition: {
								offset: 9609999,
							},
							margins: {
								top: 0,
								bottom: 0,
							},
						},
					}),
				],
				// alignment: AlignmentType.CENTER,
			}),
		],
	}
}

function blankPage() {
	return {
		properties: {},
		children: [
			new Paragraph({
				children: [
					new TextRun({
						text: '',
						size: 32,
						font: 'VI Lam Anh',
						break: 18,
					}),
				],
			}),
			new Paragraph({
				children: [new PageBreak()],
			}),
		],
	}
}

function newQuestion(
	questions: Question[],
	index: number,
	imageBuffer: Buffer
) {
	return new Paragraph({
		spacing: {
			line: 276,
		},

		children: [
			new TextRun({
				text: '',
				size: 40,
				break: index === 0 ? 2 : 1,
			}),
			new ImageRun({
				data: imageBuffer,
				transformation: {
					width: 20, // Adjust based on your image and preference
					height: 20,
				},
			}),
			new TextRun({
				text: ` ${questions[index].text}`,
				size: 40,
				font: 'VI Lam Anh',
				color: '#1C1C53',
			}),
		],
		indent: {
			// left: '1in', // Adjust as necessary for overall indentation from the left margin
			firstLine: '2in', // Adjust as necessary for the first line indentation
			hanging: '10in', // Adjust for how much the second line and beyond should be indented from the first line
		},
	})
}

/**
 * *************** DOCUMENT UTILS ***************
 */

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
