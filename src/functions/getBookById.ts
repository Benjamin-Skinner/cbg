import StatusClass from '@/classes/Status'
import { DEFAULT_AR } from '@/constants'
import { Book, PageImage } from '@/types'
import clientPromise from '@/util/db'
import { image } from 'pdfkit'

const status = new StatusClass().toObject()

const emptyPageImage: PageImage = {
	status: status,
	selected: {
		url: '',
		messageId: '',
		type: '',
	},
	ar: DEFAULT_AR,
	imageOptions: [],
	prompt: {
		status: status,
		content: '',
	},
	generatingImages: [],
}

export async function getBookById(bookId: string) {
	const client = await clientPromise
	const db = client.db()
	const bookDoc = await db.collection('books').findOne({ id: bookId })
	if (!bookDoc) throw new Error('No book found')
	let book: Book = {
		id: bookDoc.id.toString(),
		title: bookDoc.title,
		aiContext: bookDoc.aiContext,
		blurb: bookDoc.blurb,
		status: bookDoc.status || 'inProgress',
		oneLiner: bookDoc.oneLiner,
		description: bookDoc.description,
		recallAndReflect: bookDoc.recallAndReflect,
		outline: bookDoc.outline,
		frontCover: bookDoc.frontCover,
		backCover: bookDoc.backCover,
		insideCover: bookDoc.insideCover,
		createdAt: bookDoc.createdAt,
		lastSaved: bookDoc.lastSaved,
		pages: bookDoc.pages,
		files: bookDoc.files,
	}

	if (!book.pages.intro.image.ar) {
		book.pages.intro.image.ar = DEFAULT_AR
	}

	if (!book.pages.intro.layout) {
		book.pages.intro.layout = 'imageFirst'
	}

	if (!book.pages.conclusion.image.ar) {
		book.pages.conclusion.image.ar = DEFAULT_AR
	}

	if (!book.pages.conclusion.layout) {
		book.pages.conclusion.layout = 'imageFirst'
	}

	for (const page of book.pages.chapters) {
		if (!page.image.ar) {
			page.image.ar = DEFAULT_AR
		}
		if (!page.layout) {
			page.layout = 'imageFirst'
		}
		for (const option of page.image.imageOptions) {
			if (!option.ar) {
				option.ar = DEFAULT_AR
			}
		}
	}

	if (!book.files) {
		book.files = []
	}

	// if (!book.recallAndReflect) {
	// 	book.recallAndReflect = {
	// 		image: emptyPageImage,
	// 		recall: {
	// 			questions: [],
	// 			status: status,
	// 			activePages: [],
	// 		},
	// 		reflect: {
	// 			questions: [],
	// 			activePages: [],
	// 			status: status,
	// 		},
	// 	}
	// }

	return book
}
