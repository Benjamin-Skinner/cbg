import * as fs from 'fs'
import {
	Document,
	Paragraph,
	ImageRun,
	PageBreak,
	AlignmentType,
	TextRun,
} from 'docx'
import { Book, Page, Question, RandR } from '@/types'
import { downloadMidjourneyImage } from '../image'
import { saveDoc } from './util'
import splitText from '../splitText'
import { RandRIcon } from '@/components/Icons'

export async function generateDoc(
	book: Book,
	version: string,
	filepath: string
) {
	const rAndRImage = fs.readFileSync(
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
			newRandR(
				book.recallAndReflect.recall.questions,
				rAndRImage,
				'Recall'
			),
			newRandR(
				book.recallAndReflect.reflect.questions,
				rAndRImage,
				'Reflect'
			),
		],
	})

	saveDoc(doc, filepath)
}

/**
 * *************** BOOK BUILDING ***************
 */

/**
 * TYPES
 */

type ImageLayout = {
	horizontalPosition: 'left' | 'right' | 'center'
	verticalPosition: 'bottom' | 'center' | 'top' | 'inside' | 'outside'
	width: number
	height: number
}

type TextLayout = {
	break: number
}

async function newPage(page: Page, book: Book) {
	console.log(`Downloading Image for Page ${page.title}`)
	const { imgPath } = await downloadMidjourneyImage(
		page.image.selected.url,
		book,
		page.title
	)

	console.log(`Image downloaded to: ${imgPath}`)
	console.log(`Reading image buffer`)
	const imageBuffer = fs.readFileSync(imgPath)

	console.log(`Creating new page`)

	if (page.layout === 'fullPage') {
		const fullPageTextLayout: TextLayout = {
			break: 22,
		}
		const height = 800
		const width = 800 * 2.5 // image AR is 5:2

		const leftFullPageImageLayout: ImageLayout = {
			horizontalPosition: 'left',
			verticalPosition: 'top',
			width: width,
			height: height,
		}

		const rightFullPageImageLayout: ImageLayout = {
			horizontalPosition: 'right',
			verticalPosition: 'top',
			width: width,
			height: height,
		}

		const { firstHalf, secondHalf } = splitText(page.text.content)
		return {
			properties: {},
			children: [
				Image(imageBuffer, leftFullPageImageLayout),
				Text(firstHalf, fullPageTextLayout),
				EndPage(),
				Image(imageBuffer, rightFullPageImageLayout),
				Text(secondHalf, fullPageTextLayout),
				EndPage(),
			],
		}
	}

	const imageLayout: ImageLayout = {
		horizontalPosition: 'center',
		verticalPosition: page.layout === 'imageFirst' ? 'top' : 'bottom',
		width: 650,
		height: 650,
	}

	const textLayout: TextLayout = {
		break: page.layout === 'imageFirst' ? 18 : 0,
	}

	return {
		properties: {},
		children: [
			Image(imageBuffer, imageLayout),
			Text(page.text.content, textLayout),
			EndPage(),
		],
	}
}

function EndPage() {
	return new Paragraph({
		children: [new PageBreak()],
	})
}

function Image(imageBuffer: Buffer, layout: ImageLayout) {
	return new Paragraph({
		children: [
			new ImageRun({
				data: imageBuffer,
				transformation: {
					width: layout.width,
					height: layout.height,
				},
				floating: {
					horizontalPosition: {
						align: layout.horizontalPosition,
					},
					verticalPosition: {
						align: layout.verticalPosition,
					},
					margins: {
						top: 0,
						bottom: 0,
					},
				},
			}),
		],
	})
}

function Text(text: string, layout: TextLayout) {
	return new Paragraph({
		spacing: {
			line: 276,
		},
		alignment: AlignmentType.CENTER,
		children: [
			new TextRun({
				text: text,
				size: 32,
				font: 'VI Lam Anh',
				break: layout.break,
			}),
		],
	})
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
