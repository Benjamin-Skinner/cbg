export const NUM_CHAPTERS = 15 // not including intro and conclusion

export const SECTION_GUIDELINES = {
	page: [
		'Wording of the text is appropriate for children.',
		'The image matches the text.',
		'The image is positive and happy.',
		'All hands, feet and faces look realistic.',
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
}

export const IMAGE_POLL_TIME = 5 // seconds

export const EXCLUDE = ['0dc23ae0-b6ff-4cd3-866e-082e5d76247e']
