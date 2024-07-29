import { Blurb, Book } from '@/types'
import clientPromise from '@/util/db'
import { EXCLUDE } from '@/constants'

export async function getAllBooks() {
	console.log('Getting all books function')
	// setFieldOnAllBookDocs()
	const client = await clientPromise
	console.log('client')
	const db = client.db()
	console.log('connected to db')
	const bookDocs = await db.collection('books').find({})

	console.log('BOOK DOCS', bookDocs)

	const books = []

	for await (const bookDoc of bookDocs) {
		const book: Book = {
			id: bookDoc.id.toString(),
			title: bookDoc.title,
			blurb: bookDoc.blurb,
			status: bookDoc.status || 'inProgress',
			description: bookDoc.description,
			outline: bookDoc.outline,
			oneLiner: bookDoc.oneLiner,
			recall: bookDoc.recall,
			reflect: bookDoc.reflect,
			frontCover: bookDoc.frontCover,
			backCover: bookDoc.backCover,
			createdAt: bookDoc.createdAt,
			lastSaved: bookDoc.lastSaved,
			pages: bookDoc.pages,
		}
		books.push(book)
	}

	const filtered = books
		.filter((book: Book) => !EXCLUDE.includes(book.id))
		.sort((a, b) => a.lastSaved - b.lastSaved)

	return filtered
}

async function setFieldOnAllBookDocs() {
	// set blurb object
	const defaultBlurb: Blurb = {
		text: '',
		status: {
			message: {
				code: '',
				content: '',
				dismissed: false,
			},
			generating: {
				inProgress: false,
				progress: 0,
			},
		},
	}

	const client = await clientPromise
	const db = client.db()
	const bookDocs = await db.collection('books').find({})

	// for await (const bookDoc of bookDocs) {
	// 	await db.collection('books').updateOne(
	// 		{ _id: bookDoc._id },
	// 		{
	// 			$set: {
	// 				blurb: defaultBlurb,
	// 			},
	// 		}
	// 	)
	// }
}
