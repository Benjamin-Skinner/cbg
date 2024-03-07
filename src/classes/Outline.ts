import { Outline } from '@/types'
import StatusClass from '@/classes/Status'

class OutlineClass {
	private outline: Outline

	constructor(outline: Outline) {
		this.outline = outline
	}

	setStatus(status: StatusClass) {
		this.outline.status = status.toObject()
	}

	toObject() {
		return this.outline
	}
}

export default OutlineClass
