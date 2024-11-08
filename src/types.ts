import CBGError from '@/classes/Error'

export type Book = {
	id: string
	title: string
	aiContext: string
	status: 'inProgress' | 'uploaded' | 'abandoned' | 'awaitingReview'
	blurb: Blurb
	oneLiner: string
	description: Description
	outline: Outline
	recallAndReflect: RecallAndReflect
	frontCover: {
		hard: Cover
		paper: Cover
	}
	backCover: Cover
	insideCover: Cover
	pages: BookPages
	lastSaved: number
	createdAt: number
	files: BookFiles[]
}

export type BookFiles = {
	name: string
	url: string
	type: string
}

export type RecallAndReflect = {
	image: PageImage
	recall: RandR
	reflect: RandR
}

export type Blurb = {
	text: string
	status: Status
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
	tiling: boolean
	messageId: string
	type: 'manual' | 'midjourney'
	ar: ImageAR
}

// For images that are being generated
export type ImageOptionGenerating = {
	messageId: string
	progress: number
	tiling: boolean
	completed: boolean // whether the UpscaleJobs have been created or whether the image is ready
	upscales: UpscaleJob[]
	ar: ImageAR
	processing: boolean
}

export type ImageUpdateResponse = {
	newImages: boolean // whether or not there are new images that have been added to ImageOptions
	newImageOptions: ImageOption[] // the new images that have been added
	status: Status // the new status of the PageImage
}

export type UpscaleJob = {
	messageId: string
	completed: boolean
	progress: number
	url: string
	button: 'U1' | 'U2' | 'U3' | 'U4'
	error: string
	ar: ImageAR
	tiling: boolean
}

export type PageLayoutOption = 'textFirst' | 'imageFirst' | 'fullPage'

export type Page = {
	title: string
	layout: PageLayoutOption
	key: string
	currPosition: number
	subjectLocked: boolean
	text: {
		status: Status
		content: string
	}
	image: PageImage
}

export type ImageAR = {
	fullPage: boolean
	square: boolean
	height: number
	width: number
}

export type ImagePrompt = {
	status: Status
	content: string
}

export type SelectedImage = {
	url: string
	messageId: string
	type: 'manual' | 'midjourney' | ''
}

export type PageImage = {
	status: Status
	selected: SelectedImage
	ar: ImageAR
	imageOptions: ImageOption[]
	prompt: ImagePrompt
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
	subject: SubjectCategory
}

export type SubjectCategory =
	| 'Other'
	| 'History'
	| 'Geography'
	| 'Science'
	| 'Art'
	| 'User'
	| 'Career'

export type Subject = {
	id?: string
	title: string
	oneLiner: string
	options: SubjectOptions
	createdAt: number
	saved: boolean
	current: boolean
}

export type TextGenerationMode = 'generate' | 'add' | 'reduce' | 'edit'
