import { Subject, SubjectOptions } from '@/types'
// @ts-ignore
import parseXlsx from 'excel'
import fs from 'fs'
import generateText from './openai'

const TOTAL_ITERATIONS = 3

/**
 * *************** EXPORTED FUNCTIONS ***************
 */
export async function generateSubjects(
	options: SubjectOptions,
	prompt: string
): Promise<Subject[]> {
	console.log('generateSubjects with options:', options)
	const fullPrompt = await getFullPrompt(options, prompt)
	console.log(fullPrompt)

	// Generate subjects
	const promises: Promise<
		{
			title: string
			oneLiner: string
		}[]
	>[] = []

	const num = options.subject === 'User' ? TOTAL_ITERATIONS : TOTAL_ITERATIONS

	for (let i = 0; i < num; i++) {
		promises.push(generateSubjectsGPT(fullPrompt))
	}

	const subjects: { title: string; oneLiner: string }[] =
		await Promise.allSettled(promises)
			// Get all the subjects that were successfully generated
			.then((results) =>
				results.flat().filter((result) => result.status === 'fulfilled')
			)
			// Flatten the array
			.then((filteredResults) => {
				// @ts-ignore
				return filteredResults.map((result) => result.value).flat()
			})

	const time = Date.now()
	// Give the subjects the correct options
	const fullSubjects = subjects.map((subject) => {
		const newSubject: Subject = {
			options: options,
			createdAt: time,
			title: subject.title,
			oneLiner: subject.oneLiner,
			saved: false,
			current: true,
		}
		return newSubject
	})

	return fullSubjects
}

/**
 * *************** INTERNAL FUNCTIONS ***************
 */
/**
 * Generates five formatted Subjects from the prompt
 */
async function generateSubjectsGPT(prompt: string): Promise<
	{
		title: string
		oneLiner: string
	}[]
> {
	const output = await generateText(prompt)
	const subjects = formatOutput(output)
	return subjects
}

/**
 * Gets the full prompt for generating subjects, based on the options
 */
async function getFullPrompt(
	options: SubjectOptions,
	prompt: string
): Promise<string> {
	if (options.subject === 'Science') {
		return getSciencePrompt()
	} else if (options.subject === 'History') {
		return getHistoryPrompt()
	} else if (options.subject === 'Other') {
		return getOtherPrompt()
	} else if (options.subject === 'User') {
		return getUserPrompt(prompt)
	} else if (options.subject === 'Career') {
		return getCareerPrompt()
	} else {
		throw new Error('Invalid subject')
	}
}

/**
 * Parses the JSON in order to get the subjects
 */
function formatOutput(output: string): {
	title: string
	oneLiner: string
}[] {
	const data = JSON.parse(output)
	const subjects: Subject[] = data.subjects.map((subject: any) => {
		return {
			title: subject.title,
			oneLiner: subject.oneLiner,
		}
	})

	return subjects
}

function formattedOutputExample(
	examples: { title: string; oneLiner: string }[]
) {
	return `{
    "subjects": [
        ${examples.map(
			(example) =>
				`{
            "title": "${example.title}",
            "oneLiner": "${example.oneLiner}"
        }`
		)},
    ]
}
`
}

/**
 * *************** SPECIFIC SUBJECT PROMPTS ***************
 */

function getSciencePrompt() {
	const examples: { title: string; oneLiner: string }[] = [
		{
			title: 'Dinosaurs Uncovered',
			oneLiner:
				"Discover different types of dinosaurs, from the Stegasaurus to the T-Rex, in 'Dinosaurs Uncovered'! This engaging children's book will take young readers on a journey through the prehistoric world.",
		},
		{
			title: 'Space Explorers',
			oneLiner:
				"Learn about different cosmic phenomena, from black holes to supernovas, in 'Space Explorers'! This educational children's book will spark curiosity about the universe.",
		},
		{
			title: 'The Wonders of Weather',
			oneLiner:
				"Step into the world of meteorology and discover the fascinating science behind weather phenomena! 'The Wonders of Weather' will engage young readers as they learn about rainbows, thunderstorms, and other weather wonders.",
		},
		{
			title: 'Magnificent Marine Life',
			oneLiner:
				"Dive into the underwater world and meet the incredible creatures that inhabit our oceans! 'Magnificent Marine Life' will introduce children to colorful coral reefs, playful sea otters, and majestic whales.",
		},
		{
			title: 'Journey Through the Jungle',
			oneLiner:
				"This book introduces children to various animals that inhabit the jungle, from gorillas and tigers to snakes and parrots. 'Journey Through the Jungle' is an exciting adventure that will teach young readers about the diverse wildlife of the rainforest.",
		},
	]

	const exampleText = formattedOutputExample(examples)

	const prompt =
		"Give me a list of 5 creative subject ideas for scientific fact-based children's books in JSON format. The title should be educational and interesting to children ages 3 to 7. They should teach children about a specific science concept. Follow examples below: "

	return prompt + exampleText
}

function getHistoryPrompt() {
	const examples: { title: string; oneLiner: string }[] = [
		{
			title: 'Adventures in American History',
			oneLiner:
				"Travel back in time and explore key moments in American history, from the founding of the nation to important events like the Civil Rights Movement. 'Adventures in American History' is an exciting educational journey for young readers.",
		},
		{
			title: 'Inventions That Changed the World',
			oneLiner:
				"From the wheel to the internet, discover the groundbreaking inventions that shaped modern society. 'Inventions That Changed the World' introduces young readers to the brilliant minds behind these revolutionary creations.",
		},
	]

	const exampleText = formattedOutputExample(examples)

	const prompt =
		"Give me a list of 5 creative subject ideas for historical fact-based children's books in JSON format. The title should be educational and interesting to children ages 3 to 7. They should each have a cohesive historical theme. Follow examples below: "

	return prompt + exampleText
}

function getOtherPrompt() {
	const examples: { title: string; oneLiner: string }[] = [
		{
			title: 'Exploring the Quraysh People',
			oneLiner:
				'Learn about the Quraysh people and their history in a unique and engaging book that offers insight into their culture and traditions.',
		},
		{
			title: 'Understanding Cryptpgraphy for Kids',
			oneLiner:
				'Introduce children to the fascinating world of cryptography and codes in a fun and educational book that will spark their curiosity and creativity.',
		},
		{
			title: 'Forms of Government',
			oneLiner:
				'Explore different forms of government, from democracy to monarchy, in an engaging and informative book that will help children understand the world around them.',
		},
	]

	const exampleText = formattedOutputExample(examples)

	const prompt =
		"Give me a list of 5 creative subject ideas for fact-based children's books in JSON format. Be as creative as possible, and try to come up with ideas that are unique and innovative. The title should be educational and interesting to children ages 3 to 7. They should each have a unique cohesive theme. Follow examples below: "

	return prompt + exampleText
}

function getUserPrompt(prompt: string) {
	const examples: { title: string; oneLiner: string }[] = [
		{
			title: 'Critter Care',
			oneLiner:
				"Discover the skills and dedication required to become a veterinarian, from diagnosing illnesses to administering treatments. 'Critter Care' is an inspiring and insightful peek into the important work of caring for animals.",
		},
		{
			title: 'Language Tree',
			oneLiner:
				"Step into the language tree and learn about the branches of languages that have grown and branched off from each other throughout history. 'Language Tree' is a colorful exploration of the roots of communication.",
		},
	]

	const exampleText = formattedOutputExample(examples)

	const fullPrompt = `Give me a list of 5 creative subject ideas for a fact-based children's book with the following description: ${prompt}. Respond in JSON format. The title should be educational and interesting to children ages 3 to 7. Never include specific characters or names. Follow examples below: `

	return fullPrompt + exampleText
}

function getCareerPrompt() {
	const examples: { title: string; oneLiner: string }[] = [
		{
			title: 'Critter Care',
			oneLiner:
				"Discover the skills and dedication required to become a veterinarian, from diagnosing illnesses to administering treatments. 'Critter Care' is an inspiring and insightful peek into the important work of caring for animals.",
		},
		{
			title: 'Space Explorers',
			oneLiner:
				"Blast off to the stars and discover the fascinating world of astronauts and space exploration. 'Space Explorers' is full of fun facts about what it's like to work in outer space.",
		},
		{
			title: 'Tech Titans',
			oneLiner:
				"Enter the fast-paced world of technology and learn about the innovative careers of programmers, engineers, and inventors who shape the future. 'Tech Titans' is an exciting glimpse into the digital age.",
		},
	]

	const exampleText = formattedOutputExample(examples)

	const fullPrompt = `Give me a list of 5 creative subject ideas for a fact-based children's book to help kids learn about different careers. Respond in JSON format. The title should be exciting and interesting to children ages 3 to 7. Never include specific characters or names. Follow examples below: `

	return fullPrompt + exampleText
}
