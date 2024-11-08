import { Blurb, Book, Cover, PageImage, Status } from '@/types'
import clientPromise from '@/util/db'
import { DEFAULT_AR, EXCLUDE } from '@/constants'

export async function getAllBooks() {
	// setFieldOnAllBookDocs()
	const client = await clientPromise
	const db = client.db()
	const bookDocs = await db.collection('books').find({})

	const books = []

	for await (const bookDoc of bookDocs) {
		const book: Book = {
			id: bookDoc.id.toString(),
			title: bookDoc.title,
			blurb: bookDoc.blurb,
			status: bookDoc.status || 'inProgress',
			description: bookDoc.description,
			outline: bookDoc.outline,
			aiContext: bookDoc.aiContext,
			oneLiner: bookDoc.oneLiner,
			insideCover: bookDoc.insideCover,
			recallAndReflect: bookDoc.recallAndReflect,
			frontCover: bookDoc.frontCover,
			backCover: bookDoc.backCover,
			createdAt: bookDoc.createdAt,
			lastSaved: bookDoc.lastSaved,
			pages: bookDoc.pages,
			files: bookDoc.files,
		}
		books.push(book)
	}

	const filtered = books
		.filter((book: Book) => !EXCLUDE.includes(book.id))
		.sort((a, b) => a.lastSaved - b.lastSaved)

	return filtered
}

async function setFieldOnAllBookDocs() {
	// set frontCover object

	const frontCover = {
		hard: EMPTY_COVER,
		soft: EMPTY_COVER,
	}

	const client = await clientPromise
	const db = client.db()
	const bookDocs = await db.collection('books').find({})

	for await (const bookDoc of bookDocs) {
		await db.collection('books').updateOne(
			{ _id: bookDoc._id },
			{
				$set: {
					frontCover: frontCover,
				},
			}
		)
	}
}

const EMPTY_STATUS: Status = {
	message: {
		code: '',
		content: '',
		dismissed: false,
	},
	generating: {
		inProgress: false,
		progress: 0,
	},
}

const EMPTY_COVER: Cover = {
	imageIdeas: {
		ideas: [],
		status: EMPTY_STATUS,
	},
	image: {
		ar: DEFAULT_AR,
		status: EMPTY_STATUS,
		imageOptions: [],
		generatingImages: [],
		prompt: {
			content: '',
			status: EMPTY_STATUS,
		},
		selected: {
			url: '',
			messageId: '',
			type: '',
		},
	},
}

// const EMPTY_PAGE_IMAGE: PageImage = {
// 	status: EMPTY_STATUS,
// 	image: {

//     },
// 	ar: DEFAULT_AR,
// 	imageOptions: [],
// 	prompt: {
// 		content: '',
// 		status: EMPTY_STATUS,
// 	},
// 	generatingImages: [],
// }

// type PageImage = {
// 	status: Status
// 	image: string
// 	ar: ImageAR
// 	imageOptions: ImageOption[]
// 	prompt: ImagePrompt
// 	generatingImages: ImageOptionGenerating[]
// }
