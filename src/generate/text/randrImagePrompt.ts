// import { Book, ImagePrompt, PageImage } from '@/types'
// import StatusClass from '@/classes/Status'
// import generateText from './openai'

// async function generateImagePrompt(book: Book): Promise<ImagePrompt> {
// 	const newStatus = new StatusClass(book.recallAndReflect.image.prompt.status)

// 	try {
// 		const newPrompt = await getMidjourneyPrompt(book)
// 		const fullPrompt =
// 			'watercolor clip art on a white background of ' + newPrompt
// 		newStatus.setAsSuccess()
// 		return {
// 			status: newStatus.toObject(),
// 			content: fullPrompt,
// 		}
// 	} catch (error: any) {
// 		newStatus.setError(error.message)
// 		newStatus.clearGenerating()
// 		// Return the old page but with the error
// 		return {
// 			...book.recallAndReflect.image.prompt,
// 			status: newStatus.toObject(),
// 		}
// 	}
// }

// export default generateImagePrompt

// async function getMidjourneyPrompt(book: Book) {
// 	const prompt = `Given the title of a children's book, give me a simple idea for a wallpaper pattern relevant to the subject matter of the book. The description should be interesting as a tiled wallpaper pattern. Follow the examples:

//     Title: "Journey Through the Jungle"
//     Image: a forest of trees with animals in it

//     Title: "Wonders of the World"
//     Image: skyline of a city with skyscrapers

//     Title: "Mystery of the Moon"
//     Image: a starry night with the moon in different phases

//     Title: "Adventures in History"
//     Image: an ocean with a Viking ship sailing across it

//     Title: "The Solar System Safari"
//     Image: a space scene with planets and stars

//     Title: "Lets Discover California"
//     Image: mountains with snow on top

//     Title: "Ocean Odyssey"
//     Image: an underwater scene with fish and coral

//     Title: "${book.title}"
//     Image:`

// 	const response = await generateText(prompt)

// 	if (!response) {
// 		throw new Error('Failed to generate image prompt')
// 	}

// 	return response
// }
