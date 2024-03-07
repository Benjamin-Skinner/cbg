import { Status } from '@/types'

// export type Status = {
// 	message: {
// 		code: 'success' | 'error' | ''
// 		content: string
// 		dismissed: boolean
// 	}
// 	generating: {
// 		inProgress: boolean
// 		progress: number
// 	}
// }
class StatusClass {
	status: Status
	constructor(status?: Status) {
		this.status = status || {
			message: {
				code: '',
				content: '',
				dismissed: false,
			},
			generating: {
				inProgress: false,
				progress: 0,
			},
		}
	}

	setError(message: string) {
		this.status.message.code = 'error'
		this.status.message.content = message
		this.status.message.dismissed = false
	}

	beginGenerating() {
		this.status.generating.inProgress = true
		this.status.generating.progress = 0
	}

	clearMessage() {
		this.status.message.code = ''
		this.status.message.content = ''
		this.status.message.dismissed = false
	}

	clearGenerating() {
		this.status.generating.inProgress = false
		this.status.generating.progress = 0
	}

	setAsSuccess() {
		this.clearGenerating()
		this.clearMessage()
	}

	toObject() {
		return this.status
	}
}

export default StatusClass
