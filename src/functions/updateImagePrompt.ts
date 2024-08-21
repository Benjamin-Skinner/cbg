import { ImagePrompt } from '@/types'
import clientPromise from '@/util/db'

export async function updateBackCoverPrompt(
	bookId: string,
	prompt: ImagePrompt
) {
	const client = await clientPromise
	const db = client.db()
	await db.collection('books').updateOne(
		{ id: bookId },
		{
			$set: {
				'backCover.image.prompt': prompt,
			},
		}
	)
}

export async function updateInsideCoverPrompt(
	bookId: string,
	prompt: ImagePrompt
) {
	const client = await clientPromise
	const db = client.db()
	await db.collection('books').updateOne(
		{ id: bookId },
		{
			$set: {
				'insideCover.image.prompt': prompt,
			},
		}
	)
}

export async function updateHardcoverPrompt(
	bookId: string,
	prompt: ImagePrompt
) {
	const client = await clientPromise
	const db = client.db()
	await db.collection('books').updateOne(
		{ id: bookId },
		{
			$set: {
				'frontCover.hard.image.prompt': prompt,
			},
		}
	)
}

export async function updateRAndRPrompt(bookId: string, prompt: ImagePrompt) {
	const client = await clientPromise
	const db = client.db()
	await db.collection('books').updateOne(
		{ id: bookId },
		{
			$set: {
				'recallAndReflect.image.prompt': prompt,
			},
		}
	)
}

export async function updatePageImagePrompt(
	bookId: string,
	prompt: ImagePrompt,
	pageKey: string
) {
	const client = await clientPromise
	const db = client.db()
	const books = await db.collection('books')

	if (pageKey === 'intro') {
		// Update the intro page
		await books.updateOne(
			{ id: bookId },
			{
				$set: {
					'pages.intro.image.prompt': prompt,
				},
			}
		)
		return
	}

	if (pageKey === 'conclusion') {
		// Update the conclusion page
		await books.updateOne(
			{ id: bookId },
			{
				$set: {
					'pages.conclusion.image.prompt': prompt,
				},
			}
		)
		return
	} else {
		await books.updateOne(
			{
				id: bookId,
			},
			{
				$set: {
					'pages.chapters.$[elem].image.prompt': prompt,
				},
			},
			{
				arrayFilters: [{ 'elem.key': pageKey }],
			}
		)
	}
}
