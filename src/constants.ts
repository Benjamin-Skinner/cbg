import { ImageAR } from './types'

export const NUM_CHAPTERS = 12 // not including intro and conclusion

export const SECTION_GUIDELINES = {
	context: [
		'Fed to the AI as context when writing the pages.',
		'Will not be applied to the intro or conclusion.',
		'Leave the section blank to start.',
		'Add content later if needed',
	],
	page: [
		'TEXT: Wording of the text is appropriate for children.',
		'TEXT: The flow of the text is effective and engaging',
		'TEXT: Each sentence is either a transition or information',
		'TEXT: ',
		'IMAGE: The image matches the text.',
		'IMAGE: The image is positive and happy.',
		'IMAGE: All hands, feet and faces look realistic.',
	],
	backcover: [
		'The image should be a background image that can be easily cropped',
		'The image will be partially transparent, so it should not be too busy',
		'The image will be partially covered by text',
	],
	frontcover: [
		'The image should be eye-catching and engaging',
		'The image should accurately reflect the subject of the book',
	],
	description: [
		'Is engaging and informative for parents',
		'Accurately reflects the content of the book',
	],
	recall: [
		'Each question should be clear and concise',
		'Each question is based directly on the text',
	],
	reflect: [
		'Each question should be clear and concise',
		'Each question is interesting and thought-provoking for children',
	],
	outline: [
		'Each chapter is unique',
		'Each chapter has a single simple subject',
		'There is diverse representation',
		'The chapters are in a logical order',
	],
}

export const PROMPT_TIPS = {
	page: ['Give the prompt some relevant context based on the text'],
	backcover: [
		'The image will be partially transparent and covered by text',
		'Try the phrase "background pattern',
	],
	frontcover: [],
	description: [],
	recall: [],
	reflect: [],
	outline: [],
	context: [],
}

export const IMAGE_POLL_TIME = 5 // seconds

export const EXCLUDE = ['0dc23ae0-b6ff-4cd3-866e-082e5d76247e']

export const DEFAULT_AR: ImageAR = {
	fullPage: false,
	square: true,
	height: 1,
	width: 1,
}

export const SQUARE_AR: ImageAR = {
	fullPage: false,
	square: true,
	height: 1,
	width: 1,
}

export const FULL_PAGE_AR: ImageAR = {
	fullPage: true,
	square: false,
	height: 2,
	width: 5,
}

export const HARDCOVER_AR: ImageAR = {
	fullPage: false,
	square: false,
	height: 22,
	width: 17,
}

export const RANDR_IMAGE_AR: ImageAR = {
	fullPage: false,
	square: false,
	height: 1,
	width: 4,
}

export const MIDJOURNEY_BASE_URL = 'https://api.mymidjourney.ai'
