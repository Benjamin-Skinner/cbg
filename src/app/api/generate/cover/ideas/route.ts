// import { ensureParams } from '@/util/ensureParams'
// import CBGError from '@/classes/Error'
// import { NextResponse } from 'next/server'
// import StatusClass from '@/classes/Status'
// import { Cover, ImageIdeas } from '@/types'
// import { Book } from '@/types'
// import updateCover from '@/functions/updateCover'
// import { generateCoverIdeas } from '@/generate/text/coverIdeas'

// export async function POST(req: Request, res: Response) {
// 	const params: {
// 		book: Book
// 		cover: Cover
// 		front: boolean
// 		back: boolean
// 	} = await req.json()

// 	const { error, isError } = ensureParams(params, [
// 		'book',
// 		'cover',
// 		'front',
// 		'back',
// 	])

// 	if (isError && error) {
// 		return error.toResponse()
// 	}

// 	try {
// 		console.log('Generating image ideas')
// 		// Set status as generating
// 		const newStatus = new StatusClass(params.cover.imageIdeas.status)
// 		newStatus.beginGenerating()

// 		// Update the cover with the new status; Book is now generating
// 		const newCover = params.cover
// 		newCover.imageIdeas.status = newStatus.toObject()
// 		await updateCover(params.book, newCover, params.front, params.back)

// 		const newIdeas: ImageIdeas = await generateCoverIdeas(
// 			params.book,
// 			params.cover,
// 			params.front,
// 			params.back
// 		)

// 		newCover.imageIdeas = newIdeas

// 		await updateCover(params.book, newCover, params.front, params.back)

// 		return NextResponse.json(
// 			{
// 				data: newCover,
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
