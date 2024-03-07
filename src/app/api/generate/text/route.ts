import { ensureParams } from '@/util/ensureParams'
import sleep from '@/util/sleep'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page, RandR } from '@/types'
import clientPromise from '@/util/db'
import { Book } from '@/types'
import generatePageText from '@/generate/text/page'

export async function POST(req: Request, res: Response) {
	const params: {
		book: Book
		page: Page
		intro: boolean
		conclusion: boolean
	} = await req.json()

	const { error, isError } = ensureParams(params, [
		'book',
		'page',
		'intro',
		'conclusion',
	])

	if (isError && error) {
		return error.toResponse()
	}

	await sleep(5000)

	try {
		// Set status as generating
		const newStatus = new StatusClass(params.page.text.status)
		newStatus.beginGenerating()

		// Update the page with the new status; Book is now generating
		const newPage = params.page
		newPage.text.status = newStatus.toObject()
		await updatePage(params.book, newPage, params.intro, params.conclusion)

		// Generate new text
		const page = await generatePageText(
			params.book,
			newPage,
			params.intro,
			params.conclusion
		)
		await updatePage(params.book, page, params.intro, params.conclusion)
		return NextResponse.json(
			{
				data: page,
			},
			{
				status: 200,
			}
		)
	} catch (error: any) {
		return new CBGError(
			error.message || 'Internal server error',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}

/**
 * @function updatePage
 *
 * @summary
 * Takes a book and page, and updates the page in the database.
 * Works for any page, including intro and conclusion.
 *
 * @param {Book} book - The book to update
 * @param {Page} page - The page to update
 * @param {boolean} intro - Whether the page is an intro
 * @param {boolean} conclusion - Whether the page is a conclusion
 *
 * @returns
 *
 * @remarks
 */
async function updatePage(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
) {
	console.log('updating page in DB')
	const client = await clientPromise
	const db = client.db()
	const books = db.collection('books')
	const newChapters = book.pages.chapters.map((p: Page) => {
		if (p.key === page.key) {
			return page
		}
		return p
	})

	const newPages = { ...book.pages, chapters: newChapters }
	if (intro) {
		newPages.intro = page
	}
	if (conclusion) {
		newPages.conclusion = page
	}
	await books.findOneAndUpdate({ id: book.id }, { $set: { pages: newPages } })
}
