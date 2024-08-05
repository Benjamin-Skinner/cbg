import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover } from '@/types'
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

		const openAiPrompt = `Generate a description of a feature image for a book called ${book.title}.
    The description should be one short sentence. There should be only one subject, and it should be 
    relevant to the book's content, providing a wholistic view of the book's theme.
    Base it closely on the following examples:
    
    Book: Let's Discover California
    Description: watercolor image of a beach sunset; white background --no background

    Book: Ocean Odyssey
    Description: watercolor image of a wave crashing on a rock; white background --no background
 
    Book: Amazing Animals
    Description: watercolor image of a forest; white background --no background

    Book: Wonders of the World
    Description: watercolor image of a majestic city skyline; white background --no background

    Book: Ocean Odyssey
    Description: watercolor image of a wave crashing on a rock; white background --no background

    Book: ${book.title}
    Description:`

		const newPrompt = await generateImagePrompt(
			book.insideCover.image.prompt,
			openAiPrompt
		)

		const newInsideCover: Cover = {
			...book.insideCover,
			image: {
				...book.insideCover.image,
				prompt: newPrompt,
			},
		}

		await updateBook({
			...book,
			insideCover: newInsideCover,
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
