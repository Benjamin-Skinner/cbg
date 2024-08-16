import CBGError from '@/classes/Error'
import { ensureParams } from '@/util/ensureParams'
import { NextResponse } from 'next/server'
import { Book, Page, PageImage } from '@/types'
import { updateImages } from '@/generate/image/midjourney'
import { getBookById } from '@/functions/getBookById'
import updatePage from '@/functions/updatePage'
import getPageFromKey from '@/util/pageFromKey'

export async function POST(req: Request, res: Response) {
	const params: {
		bookId: string
		pageKey: string
	} = await req.json()

	const { error, isError } = ensureParams(params, ['bookId', 'pageKey'])

	if (isError && error) {
		return error.toResponse()
	}

	try {
		const book = await getBookById(params.bookId)
		const page = getPageFromKey(book, params.pageKey)

		// Get the updated page images
		const newPageImage: PageImage = await updateImages(page.image, book.id)

		const newPage: Page = {
			...page,
			image: newPageImage,
		}

		const isIntro = params.pageKey === 'intro'
		const isConclusion = params.pageKey === 'conclusion'

		// Save the new page
		await updatePage(book, newPage, isIntro, isConclusion)

		// return the updated images
		return NextResponse.json({
			data: newPageImage,
		})
	} catch (e: any) {
		return new CBGError(
			e.message || 'An error occurred',
			500,
			'INTERNAL_SERVER_ERROR'
		).toResponse()
	}
}
