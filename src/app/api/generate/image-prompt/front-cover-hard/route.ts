import { ensureParams } from '@/util/ensureParams'
import CBGError from '@/classes/Error'
import { NextResponse } from 'next/server'
import { Cover } from '@/types'
import generateImagePrompt from '@/generate/text/coverImagePrompt'
import { updateBook } from '@/functions/updateBook'
import { getBookById } from '@/functions/getBookById'

export async function POST(req: Request, res: Response) {
	console.log('front-cover-hard')
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

		const openAiPrompt = `Generate a description of a front cover for a children's book called ${book.title}.
    Base it closely on the following examples:
    
    Book: Lets' Discover California
    Description: Children's watercolor book cover collage of Napa Valley, the California Capital, and the Golden Gate Bridge with "Let's Discover California" text in a simple authentic children's handwriting style on blue sky sunny day background.

    Book: Ocean Odyssey
    Description: Children's watercolor book cover collage of an orca, squid, and blue whale with "Ocean Odyssey" text in a simple authentic children's handwriting style on blue sky sunny day background.

    Book: ${book.title}
    Description:`

		const newPrompt = await generateImagePrompt(
			book.frontCover.hard.image.prompt,
			openAiPrompt
		)

		const newCover: Cover = {
			...book.frontCover.hard,
			image: {
				...book.frontCover.hard.image,
				prompt: newPrompt,
			},
		}

		await updateBook({
			...book,
			frontCover: {
				...book.frontCover,
				hard: newCover,
			},
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
