import { GenerateImageResponse, MidjourneyResponse, Page } from '@/types'
import { Book } from '@/types'
import StatusClass from '@/classes/Status'
import ImageOptionClass from '@/classes/ImageOption'

async function generateImage(page: Page): Promise<Page> {
	const newStatus = new StatusClass(page.image.status)
	try {
		const response = await generateMidJourneyImage(page.image.prompt)

		const newImageOption =
			ImageOptionClass.fromGenerateImageResponse(response).toObject()
		console.log(newImageOption)
		newStatus.setAsSuccess()
		const newOptions = page.image.imageOptions.concat(newImageOption)
		return {
			...page,
			image: {
				...page.image,
				imageOptions: newOptions,
				status: newStatus.toObject(),
			},
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		// Return the old page but with the error
		return {
			...page,
			image: {
				...page.image,
				status: newStatus.toObject(),
			},
		}
	}
}

export default generateImage

export async function generateMidJourneyImage(
	prompt: string
): Promise<GenerateImageResponse> {
	const response = await fetch(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/imagine`,
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
			body: JSON.stringify({
				prompt: prompt,
			}),
		}
	)

	const data = await response.json()
	if (data.error) {
		throw new Error(data.message.toString())
	}
	console.log(data)
	return data as GenerateImageResponse
}

export async function getMidJourneyImage(
	messageId: string
): Promise<MidjourneyResponse> {
	console.log('Fetching image from midjourney')
	console.log(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/message/${messageId}`
	)
	const response = await fetch(
		`${process.env.MIDJOURNEY_BASE_URL}/api/v1/midjourney/message/${messageId}`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization:
					`Bearer ${process.env.MIDJOURNEY_API_KEY}` as string,
			},
		}
	)
	console.log(response)

	const data = (await response.json()) as MidjourneyResponse
	console.log(data)
	return data
}
