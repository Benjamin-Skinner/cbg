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
	batchNum: number
): Promise<Subject[]> {
	const fullPrompt = await getFullPrompt(options)

	// Generate subjects
	const promises: Promise<
		{
			title: string
			oneLiner: string
		}[]
	>[] = []

	for (let i = 0; i < TOTAL_ITERATIONS; i++) {
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
			batchNum: batchNum,
			title: subject.title,
			oneLiner: subject.oneLiner,
		}
		return newSubject
	})

	console.log(fullSubjects)

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
async function getFullPrompt(options: SubjectOptions): Promise<string> {
	const basicPrompt = `Give me a list of 5 creative subject ideas for fact-based children's books in JSON format. The title should be educational and interesting to children ages 3 to 7. Follow the format of the example: 

{
    "subjects": [
        {
            "title": "Dinosaurs Uncovered",
            "oneLiner": "Discover different types of dinosaurs, from the Stegasaurus to the T-Rex, in 'Dinosaurs Uncovered'! This engaging children's book will take young readers on a journey through the prehistoric world."
        },
        {
            "title": "Space Explorers",
            "oneLiner": Learn about different cosmic phenomena, from black holes to supernovas, in 'Space Explorers'! This educational children's book will spark curiosity about the universe."
        },
        {
            "title": "The Wonders of Weather",
            "oneLiner": "Step into the world of meteorology and discover the fascinating science behind weather phenomena! 'The Wonders of Weather' will engage young readers as they learn about rainbows, thunderstorms, and other weather wonders."
        },
        {
            "title": "Magnificent Marine Life",
            "oneLiner": "Dive into the underwater world and meet the incredible creatures that inhabit our oceans! 'Magnificent Marine Life' will introduce children to colorful coral reefs, playful sea otters, and majestic whales."
        },
        {
            "title": "Journey Through the Jungle",
            "oneLiner": "This book introduces children to various animals that inhabit the jungle, from gorillas and tigers to snakes and parrots. 'Journey Through the Jungle' is an exciting adventure that will teach young readers about the diverse wildlife of the rainforest."
        }
    ]
}
`

	const data: string[][] = await readSubjectsFile()
	const addedTextFromOptions = await handleSettings(options, data)

	return basicPrompt + addedTextFromOptions
}

/**
 * @function handleSettings
 *
 * @summary
 * Generates a string to append to the prompt based on the settings.
 *
 * @param settings - The settings to generate the string from
 *
 * @returns A string to append to the prompt
 *
 * @remarks
 * The key to this function is the format of the subjects.xlsx file. It contains an array of
 * array of strings, where each subarray contains a list of strings corresponding to the columns.
 *
 * Fortunately, the format of the file is consistent, so we can use the index of the subject and
 * grade to get the corresponding description and goal.
 *
 * Format of the file:
 * Grade Level | Subject | Description | Objective | Example Title
 * ------------|---------|-------------|-----------|---------------
 *
 */
async function handleSettings(
	settings: SubjectOptions,
	data: string[][]
): Promise<string> {
	// Function to insert the subject and grade into the prompt
	const textPrompt = (description: string, goal: string) => {
		return ` It should help children to ${goal}. Generate topics about the following subject: ${description}.`
	}

	// If the settings are the default, return an empty string
	if (settings.subject === 'All' && settings.grade === 'All') {
		return ''
	}

	/* If settings or subject are 'All', return a string with the other. This doesn't work that well
    so the user should be encouraged to avoid this behavior
    */

	if (settings.subject === 'All') {
		return ` The subject should be suitable for students in grade ${settings.grade}.`
	}

	if (settings.grade === 'All') {
		return ` The subject should be related to ${settings.subject}.`
	}

	// The order of subjects so we can get the index; needed for computation
	const subjects = [
		'Reading',
		'Writing',
		'Mathematics',
		'Science',
		'Social Studies',
		'Physical Education',
		'Art',
		'Music',
		'Health',
		'Emotional Learning',
	]

	/*
        Calculate index
            For grade 1, the index of the row is equal to the index of the subject in the subjects array + 1 (since the first row is the header)

            For grade 2 - 4, the index of the row is equal to the index of the subject in the subjects array + 1 + (10 * grade)


    */

	const index =
		subjects.indexOf(settings.subject) +
		1 +
		10 * (parseInt(settings.grade) - 1)

	/*
        index[2] = description
        index[3] = goal
    */

	return textPrompt(
		data[index][2].toLowerCase(),
		data[index][3].toLowerCase()
	)
}

/**
 * @function readSubjectsFile
 *
 * @summary
 * Reads the .xlsx file that contains data about appropriate subject
 * matter for children in differenet grades
 *
 * @returns An array of arrays of strings; each array of strings
 * is a row in the spreadsheet
 *
 * @remarks
 */
async function readSubjectsFile(): Promise<string[][]> {
	try {
		const array: string[][] = await parseXlsx(
			process.cwd() + '/src/data/subjects.xlsx'
		)

		if (array.length === 0) {
			throw new Error('Failed to read data spreadsheet')
		}

		return array
	} catch (error: any) {
		throw new Error(`Failed to read data spreadsheet`)
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
