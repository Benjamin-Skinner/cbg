import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Page } from '@/types'
import { Book } from '@/types'
import updatePage from '@/functions/updatePage'
import { sendMidjourneyJob } from '@/generate/image/midjourney'
import { DEFAULT_AR } from '@/constants'

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

	try {
		if (params.page.image.prompt.content === '') {
			throw new Error('Please enter a prompt')
		}
		// Set status as generating
		const newStatus = new StatusClass(params.page.image.status)
		newStatus.beginGenerating()

		// Update the page with the new status; Book is now generating
		const newPage = params.page
		newPage.image.status = newStatus.toObject()
		await updatePage(params.book, newPage, params.intro, params.conclusion)

		const ar = params.page.image.ar || DEFAULT_AR

		// Generate Images
		const optionGenerating = await sendMidjourneyJob(
			params.page.image.prompt.content,
			ar,
			'no tiling'
		)

		// Update the page with the new image option
		const page = params.page
		newPage.image.generatingImages.push(optionGenerating)

		await updatePage(params.book, newPage, params.intro, params.conclusion)
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

/*
 * This function should check every image option of every page in the book.
 * If the status of the image option is generating, it should fetch the image from the midjourney API and update the image option with the new image or status
 *
 * Steps:
 * For each image, do the following:
 * 1) If the image is generating, fetch it and update progress
 * 2) If the four subimages have not been requested, request them all
 */
// export async function PUT(req: Request, res: Response) {
// 	const params: {
// 		book: Book
// 	} = await req.json()

// 	const { error, isError } = ensureParams(params, ['book'])

// 	if (isError && error) {
// 		return error.toResponse()
// 	}

// 	try {
// 		console.log('Updating images')
// 		const newBook = params.book

// 		// Check every page in the book
// 		for (let i = 0; i < newBook.pages.chapters.length; i++) {
// 			const page = newBook.pages.chapters[i]
// 			console.log(`Checking page ${page.title}`)

// 			// Check every image option in the page
// 			for (let j = 0; j < page.image.imageOptions.length; j++) {
// 				const option = page.image.imageOptions[j]
// 				console.log(option)

// 				// if messageId === "test", skip
// 				if (option.messageId === 'test') {
// 					continue
// 				}

// 				// If the status is generating, fetch the image from the midjourney API
// 				if (option.progress !== 100) {
// 					console.log('Image is generating, we need to fetch it')
// 					if (option.messageId) {
// 						const res = await getMidJourneyImage(option.messageId)
// 						console.log(res)
// 						const newOption =
// 							ImageOptionClass.fromMidjourneyResponse(
// 								res
// 							).toObject()
// 						page.image.imageOptions[j] = newOption
// 						console.log(newOption)
// 						console.log('Image fetched and updated')
// 					} else {
// 						console.log('No messageId found')
// 					}
// 				} else {
// 					console.log('Image is already generated')
// 				}
// 			}
// 		}

// 		await updateBook(newBook)
// 		return NextResponse.json(
// 			{
// 				data: newBook,
// 			},
// 			{
// 				status: 200,
// 			}
// 		)
// 	} catch (error: any) {
// 		return new CBGError(
// 			error.message || 'Internal server error',
// 			500,
// 			'INTERNAL_SERVER_ERROR'
// 		).toResponse()
// 	}
// }
