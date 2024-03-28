import { GenerateImageResponse, MidjourneyResponse } from '@/types'

export async function createMidjourneyJob(
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
