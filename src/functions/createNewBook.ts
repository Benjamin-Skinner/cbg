import { v4 as uuidv4 } from 'uuid'
import clientPromise from '@/util/db'
import { Book, Page } from '@/types'
import { NUM_CHAPTERS } from '@/constants'
import PageClass from '@/classes/Page'

export async function createNewBook(title: string, description?: string) {
	const newBook: Book = {
		id: uuidv4(),
		createdAt: Date.now(),
		lastSaved: Date.now(),
		title: title,
		description: {
			hardcover: {
				first: '',
				second: '',
				third: '',
			},
			softcover: {
				first: '',
				second: '',
			},
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},
		},
		outline: {
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},
		},
		recall: {
			questions: [],
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},
			activePages: [],
		},
		reflect: {
			questions: [],
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},
			activePages: [],
		},
		frontCover: {
			ideas: {
				ideas: [],
				status: {
					generating: {
						inProgress: false,
						progress: 0,
					},
					message: {
						code: '',
						content: '',
						dismissed: false,
					},
				},
			},
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},

			image: '',
			imageOptions: [],
			prompt: '',
		},
		backCover: {
			ideas: {
				ideas: [],
				status: {
					generating: {
						inProgress: false,
						progress: 0,
					},
					message: {
						code: '',
						content: '',
						dismissed: false,
					},
				},
			},
			status: {
				generating: {
					inProgress: false,
					progress: 0,
				},
				message: {
					code: '',
					content: '',
					dismissed: false,
				},
			},
			image: '',
			imageOptions: [],
			prompt: '',
		},
		pages: {
			intro: {
				title: 'Intro',
				key: 'intro',
				currPosition: 1,
				subjectLocked: true,
				text: {
					status: {
						generating: {
							inProgress: false,
							progress: 0,
						},
						message: {
							code: '',
							content: '',
							dismissed: false,
						},
					},
					content: '',
				},
				image: {
					status: {
						generating: {
							inProgress: false,
							progress: 0,
						},
						message: {
							code: '',
							content: '',
							dismissed: false,
						},
					},
					image: '',
					imageOptions: [],
					generatingImages: [],
					prompt: '',
				},
			},
			conclusion: {
				title: 'Conclusion',
				key: 'conclusion',
				currPosition: 15,
				subjectLocked: true,
				text: {
					status: {
						generating: {
							inProgress: false,
							progress: 0,
						},
						message: {
							code: '',
							content: '',
							dismissed: false,
						},
					},
					content: '',
				},
				image: {
					status: {
						generating: {
							inProgress: false,
							progress: 0,
						},
						message: {
							code: '',
							content: '',
							dismissed: false,
						},
					},
					image: '',
					imageOptions: [],
					generatingImages: [],
					prompt: '',
				},
			},
			chapters: blankChapters(),
		},
	}

	const client = await clientPromise
	const db = client.db()
	const collection = db.collection('books')
	await collection.insertOne(newBook)
	return newBook
}

function blankChapters() {
	const chapters: Page[] = []

	for (let i = 0; i < NUM_CHAPTERS; i++) {
		const newPage = new PageClass(`Chapter ${i + 1}`, i + 1)
		chapters.push(newPage.toObject())
	}

	return chapters
}
