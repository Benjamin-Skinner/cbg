import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import StatusClass from '@/classes/Status'
import { Book, Cover } from '@/types'
import updatePage from '@/functions/updatePage'
import generateImagePrompt from '@/generate/text/coverImagePrompt'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId'])

	if (isError && error) {
		return error.toResponse()
	}

	const bookId = params.bookId

	try {
		const book = await getBookById(bookId)

		const openAiPrompt = `Generate a description of a back cover image for a children's book called ${book.title}.
    The description should be one short sentence. There should be only one subject.
    Base it closely on the following examples:
    
    Book: Let's Discover California
    Description: watercolor image of the California coast with seaside bluffs

    Book: Ocean Odyssey
    Description: watercolor image of different fish swimming in the ocean
 
    Book: ${book.title}
    Description:`

		const newPrompt = await generateImagePrompt(
			book.backCover.image.prompt,
			openAiPrompt
		)

		const newBackCover: Cover = {
			...book.backCover,
			image: {
				...book.backCover.image,
				prompt: newPrompt,
			},
		}

		await updateBook({
			...book,
			backCover: newBackCover,
		})

		return NextResponse.json(
			{
				data: newPrompt,
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
