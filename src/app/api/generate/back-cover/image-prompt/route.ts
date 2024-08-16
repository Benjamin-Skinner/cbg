// import { ensureParams } from '@/util/ensureParams'
// import CBGError from '@/classes/Error'
// import { NextResponse } from 'next/server'
// import StatusClass from '@/classes/Status'
// import { Page, RandR } from '@/types'
// import { Book } from '@/types'
// import updatePage from '@/functions/updatePage'
// import generateBackCoverPrompt from '@/generate/text/backCoverPrompt'
// import updateCover from '@/functions/updateCover'

// export async function POST(req: Request, res: Response) {
// 	const params: {
// 		book: Book
// 	} = await req.json()

// 	const { error, isError } = ensureParams(params, ['book'])

// 	if (isError && error) {
// 		return error.toResponse()
// 	}

// 	try {
// 		// Set status as generating
// 		const newStatus = new StatusClass(
// 			params.book.backCover.image.prompt.status
// 		)
// 		newStatus.beginGenerating()

// 		// Update the page with the new status; Book is now generating
// 		const newCover = params.book.backCover
// 		newCover.image.prompt = {
// 			status: newStatus.toObject(),
// 			content: '',
// 		}
// 		// console.log(newPage)
// 		await updateCover(params.book, newCover, false, true)

// 		// Generate new prompt
// 		const cover = await generateBackCoverPrompt(params.book)
// 		// console.log(page)
// 		await updateCover(params.book, cover, false, true)
// 		return NextResponse.json(
// 			{
// 				data: cover,
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
