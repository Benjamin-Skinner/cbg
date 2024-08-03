import { v4 as uuidv4 } from 'uuid'
import clientPromise from '@/util/db'
import { Book, Page } from '@/types'
import { DEFAULT_AR, HARDCOVER_AR, NUM_CHAPTERS, SQUARE_AR } from '@/constants'
import PageClass from '@/classes/Page'

export async function createNewBook(title: string, oneLiner?: string) {
	const newBook: Book = {
		id: uuidv4(),
		createdAt: Date.now(),
		status: 'inProgress',
		lastSaved: Date.now(),
		blurb: {
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
		},
		title: title,
		oneLiner: oneLiner || '',
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
		recallAndReflect: {
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
			image: {
				ar: DEFAULT_AR,
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
				prompt: {
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
			},
		},
		frontCover: {
			paper: {
				imageIdeas: {
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
				image: {
					ar: SQUARE_AR,
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
					prompt: {
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
				},
			},
			hard: {
				imageIdeas: {
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
				image: {
					ar: HARDCOVER_AR,
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
					prompt: {
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
				},
			},
		},
		backCover: {
			imageIdeas: {
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
			image: {
				ar: HARDCOVER_AR,
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
				prompt: {
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
			},
		},
		insideCover: {
			imageIdeas: {
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
			image: {
				ar: SQUARE_AR,
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
				prompt: {
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
			},
		},
		pages: {
			intro: {
				layout: 'imageFirst',
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
					ar: DEFAULT_AR,
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
					prompt: {
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
				},
			},
			conclusion: {
				layout: 'imageFirst',
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
					ar: DEFAULT_AR,
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
					prompt: {
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
