import CBGError from '@/classes/Error'

export type Book = {
	id: string
	title: string
	oneLiner: string
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
	frontCover: Cover
	backCover: Cover
	pages: BookPages
	lastSaved: number
	createdAt: number
}

export type Cover = {
	imageIdeas: ImageIdeas
	image: PageImage
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
	ideas: ImageIdea[]
	status: Status
}

export type ImageIdea = {
	content: string
}

// For completed images
export type ImageOption = {
	url: string
	error: string
	type: 'manual' | 'midjourney'
}

// For images that are being generated
export type ImageOptionGenerating = {
	messageId: string
	progress: number
	completed: boolean // whether the UpscaleJobs have been created or whether the image is ready
	upscales: UpscaleJob[]
}

export type UpscaleJob = {
	messageId: string
	completed: boolean
	progress: number
	url: string
	button: 'U1' | 'U2' | 'U3' | 'U4'
	error: string
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
	image: PageImage
}

export type PageImage = {
	status: Status
	image: string
	imageOptions: ImageOption[]
	prompt: {
		status: Status
		content: string
	}
	generatingImages: ImageOptionGenerating[]
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

export type ValidatorFunction = {
	isError: boolean
	error?: CBGError
}

export type GenerateImageResponse = {
	success: boolean
	messageId: string
	createdAt: string
}

export type MidjourneyResponse = {
	messageId: string
	prompt: string
	uri: string
	progress: number
	createdAt: string
	updatedAt: string
	buttons: string[]
	originatingMessageId: string
	ref: string
	status?: string
	error?: string
}

export type SubjectOptions = {
	grade: 'All' | '1' | '2' | '3' | '4'
	subject:
		| 'All'
		| 'Reading'
		| 'Writing'
		| 'Mathematics'
		| 'Science'
		| 'Social Studies'
		| 'Physical Education'
		| 'Art'
		| 'Music'
		| 'Health'
		| 'Emotional Learning'
}

export type Subject = {
	title: string
	oneLiner: string
	options: SubjectOptions
	createdAt: number
	batchNum: number
}
