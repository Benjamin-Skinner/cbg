import { ImagePrompt } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'

async function generateImagePrompt(
	prompt: ImagePrompt,
	openAiPrompt: string,
	prefix?: string
): Promise<ImagePrompt> {
	const newStatus = new StatusClass(prompt.status)
	try {
		const newPrompt = await generateText(openAiPrompt)
		newStatus.setAsSuccess()
		return {
			status: newStatus.toObject(),
			content: prefix ? `${prefix} ${newPrompt}` : newPrompt,
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

export default generateImagePrompt
