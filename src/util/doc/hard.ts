import * as fs from 'fs'
import {
	Document,
	Paragraph,
	ImageRun,
	PageBreak,
	AlignmentType,
	TextRun,
} from 'docx'
import { Book, Cover, Page, Question, RandR } from '@/types'
import { downloadMidjourneyImage } from '../image'
import { saveDoc } from './util'
import splitText from '../splitText'

export async function generateDoc(book: Book) {
	// Download RandR image
	const { imgPath: rAndRImage } = await downloadMidjourneyImage(
		book.recallAndReflect.image.selected.url,
		book,
		'Recall and Reflect'
	)

	const doc = new Document({
		sections: [
			{
				properties: {
					page: {
						margin: {
							top: 1440, // Top margin (in twips, 1440 twips = 1 inch)
							right: 1440, // Right margin (in twips, 1440 twips = 1 inch)
							bottom: 0, // Bottom margin (in twips, 1440 twips = 1 inch)
							left: 1440, // Left margin (in twips, 1440 twips = 1 inch)
						},
					},
				},
				// Start off with two inside cover
				...(await insideCover(book)),
			},
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

	const filename = `${book.title}-hard.docx`
	const filepath = `${process.env.DOCUMENT_DIR}/${filename}`
	saveDoc(doc, filepath)
	return {
		filepath,
		filename,
	}
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

/**
 * Creates a new page with an image and text
 * Works for both full page images and regular pages
 */
async function newPage(page: Page, book: Book) {
	// console.log(`Downloading Image for Page ${page.title}`)

	// Download the image from the URL to the local filesystem
	const { imgPath } = await downloadMidjourneyImage(
		page.image.selected.url,
		book,
		page.title
	)

	// console.log(`Image downloaded to: ${imgPath}`)
	// console.log(`Reading image buffer`)
	// Get the imageBuffer which we can insert into the doc
	const imageBuffer = fs.readFileSync(imgPath)

	// console.log(`Creating new page`)

	// Handle fullpage layout
	if (page.layout === 'fullPage') {
		const fullPageTextLayout: TextLayout = {
			break: 20,
		}
		const height = 626
		const width = 626 * 2.5 // image AR is 5:2

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

	// Otherwise we're dealing with either 'imageFirst' or 'textFirst'

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

/**
 * *************** UTILS ***************
 */

/**
 * Insert a page break
 */
function EndPage() {
	return new Paragraph({
		children: [new PageBreak()],
	})
}

/**
 * Insert an image
 */
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

/**
 * Insert text
 */
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

/**
 * New RandR page
 */
function newRandR(
	questions: Question[],
	imagePath: string,
	title: 'Recall' | 'Reflect'
) {
	const imageBuffer = fs.readFileSync(imagePath)

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
			newQuestion(questions, 0),
			newQuestion(questions, 1),
			newQuestion(questions, 2),
			newQuestion(questions, 3),
			newQuestion(questions, 4),
			new Paragraph({
				children: [
					new ImageRun({
						data: imageBuffer,
						transformation: {
							width: 759,
							height: 189,
						},
						floating: {
							horizontalPosition: {
								align: 'center',
							},
							verticalPosition: {
								align: 'bottom',
							},
							margins: {
								top: 0,
								bottom: 0,
							},
						},
					}),
				],
				alignment: AlignmentType.CENTER,
			}),
		],
	}
}

function newQuestion(questions: Question[], index: number) {
	return new Paragraph({
		spacing: {
			line: 276,
		},
		alignment: AlignmentType.CENTER,

		children: [
			new TextRun({
				text: '',
				size: 40,
				break: index === 0 ? 2 : 1,
			}),

			new TextRun({
				text: ` ${questions[index].text}`,
				size: 40,
				font: 'VI Lam Anh',
				color: '#1C1C53',
			}),
		],
	})
}

async function insideCover(book: Book) {
	const { imgPath } = await downloadMidjourneyImage(
		book.insideCover.image.selected.url,
		book,
		'Inside Cover'
	)

	const imageLayout: ImageLayout = {
		horizontalPosition: 'center',
		verticalPosition: 'center',
		width: 620,
		height: 620,
	}

	return {
		children: [
			new Paragraph({
				alignment: AlignmentType.CENTER,

				indent: {
					left: 0,
					right: 0,
				},
				children: [
					new TextRun({
						text: book.title,
						size: 68,
						bold: true,
						font: 'Comfortaa',
						color: '#1C1C53',
						break: 1,
					}),
				],
			}),
			Image(fs.readFileSync(imgPath), imageLayout),
			new Paragraph({
				alignment: AlignmentType.CENTER,
				children: [
					new TextRun({
						text: 'Ethan Wiseman ● Norah Wright',
						size: 32,
						bold: true,
						font: 'Comfortaa',
						color: '#1C1C53',
						break: book.title.length > 26 ? 27 : 26, // Try to approximate if the title will be one or two lines and adjust the break accordingly
					}),
				],
			}),
			new Paragraph({
				children: [
					new ImageRun({
						data: fs.readFileSync(`src/assets/logo.png`),
						transformation: {
							width: 100,
							height: 114,
						},
						floating: {
							horizontalPosition: {
								align: 'center',
							},
							verticalPosition: {
								offset: 8809999,
							},
							margins: {
								top: 0,
								bottom: 0,
							},
						},
					}),
				],
			}),
		],
	}
}
