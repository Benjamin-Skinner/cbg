import { ImagePrompt } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'

async function generateCoverImagePrompt(
	prompt: ImagePrompt,
	openAiPrompt: string
): Promise<ImagePrompt> {
	const newStatus = new StatusClass(prompt.status)
	try {
		const newPrompt = await generateText(openAiPrompt)
		newStatus.setAsSuccess()
		return {
			status: newStatus.toObject(),
			content: newPrompt,
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		// Return the old prompt but with the error
		return {
			status: newStatus.toObject(),
			content: prompt.content,
		}
	}
}

export default generateCoverImagePrompt
