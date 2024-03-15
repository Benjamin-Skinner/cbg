import CBGError from '@/classes/Error'

export type Book = {
	id: string
	title: string
	description: Description
	outline: Outline
	recall: {
		questions: Question[]
		status: Status
		activePages: string[]
	}
	reflect: {
		questions: Question[]
		activePages: string[]
		status: Status
	}
	frontCover: {
		ideas: ImageIdeas
		status: Status
		image: string
		imageOptions: ImageOption[]
		prompt: string
	}
	backCover: {
		ideas: ImageIdeas
		status: Status
		image: string
		imageOptions: ImageOption[]
		prompt: string
	}
	pages: BookPages
	lastSaved: number
	createdAt: number
}

export type BookPages = {
	intro: Page
	conclusion: Page
	chapters: Page[]
}

export type Status = {
	message: {
		code: 'success' | 'error' | ''
		content: string
		dismissed: boolean
	}
	generating: {
		inProgress: boolean
		progress: number
	}
}

export type Question = {
	id: string
	page: string
	selected: boolean
	text: string
	fromPage: boolean
}

export type RandR = {
	questions: Question[]
	status: Status
	activePages: string[]
}

export type ImageIdeas = {
	ideas: string[]
	status: Status
}

export type ImageOption = {
	url: string
}

export type Page = {
	title: string
	key: string
	currPosition: number
	subjectLocked: boolean
	text: {
		status: Status
		content: string
	}
	image: {
		status: Status
		image: string
		imageOptions: ImageOption[]
		prompt: string
	}
}

export type Description = {
	hardcover: HardcoverDescription
	softcover: SoftcoverDescription
	status: Status
}

export type HardcoverDescription = {
	first: string
	second: string
	third: string
}

export type SoftcoverDescription = {
	first: string
	second: string
}

export type Outline = {
	status: Status
}

export type OutlinePage = {
	page: string
	locked: boolean
	key: string
}

// export type CBGError = {
// 	code: string
// 	message: string
// }

export type ValidatorFunction = {
	isError: boolean
	error?: CBGError
}
