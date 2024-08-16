import { Blurb, Book } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'
import { getRandomChapterTitles } from '@/util/random'

async function generateBlurb(book: Book): Promise<Blurb> {
	const newStatus = new StatusClass(book.blurb.status)
	newStatus.beginGenerating()

	try {
		const newBlurbText = await generateBlurbGPT(book)
		newStatus.setAsSuccess()
		return {
			text: newBlurbText,
			status: newStatus.toObject(),
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		return {
			text: book.blurb.text,
			status: newStatus.toObject(),
		}
	}
}

export default generateBlurb
async function generateBlurbGPT(book: Book): Promise<string> {
	const chapterTitles = getRandomChapterTitles(book, 4)
	const prompt = `Create a brief, engaging blurb for a children's educational book titled ${
		book.title
	} with chapters: ${chapterTitles.join(
		', '
	)}. The blurb should be exactly two sentences long and between 20-25 words. The first sentence should provide a clear overview of the content. The second sentence should be very brief and create energy and serve as a call to action, ending with an exclamation. The language should be simple and easily read aloud to children. Do not oversell the book by overusing words like "amazing", or "exciting" and "incredible." Never repeat the name of the book. Here is an example:
    "Embark on a journey through California's famous landmarks, from Hollywood to the beauty of Joshua Tree Park and more. Let's start exploring!"
    `
	const blurb = await generateText(prompt)
	return blurb
}
