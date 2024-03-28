import { ImageOption, GenerateImageResponse, MidjourneyResponse } from '@/types'

class ImageOptionClass {
	url: string
	messageId: string
	error: string
	progress: number
	constructor(url: string, messageId: string) {
		this.url = url
		this.messageId = messageId
		this.error = ''
		this.progress = 0
	}

	setError(error: string) {
		this.error = error
	}

	setProgress(progress: number) {
		this.progress = progress
	}

	toObject(): ImageOption {
		return {
			url: this.url,
			messageId: this.messageId,
			error: this.error,
			progress: this.progress,
		}
	}

	static fromGenerateImageResponse(
		response: GenerateImageResponse
	): ImageOptionClass {
		return new ImageOptionClass('', response.messageId)
	}

	static fromMidjourneyResponse(
		response: MidjourneyResponse
	): ImageOptionClass {
		const option = new ImageOptionClass(response.uri, '')
		option.setProgress(response.progress)
		return option
	}
}

export default ImageOptionClass
