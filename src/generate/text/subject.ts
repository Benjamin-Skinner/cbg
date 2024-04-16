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
	return JSON.parse(`[
  [
    "Grade Level",
    "Subject",
    "Description",
    "Objective",
    "Book Title"
  ],
  [
    "1.0",
    "Reading",
    "Introduction to literacy, phonics, and basic vocabulary",
    "Build fundamental reading skills",
    "Let's Learn Letters!"
  ],
  [
    "1.0",
    "Writing",
    "Learning to write full sentences and basic words",
    "Develop foundational writing skills",
    "My First Word Book"
  ],
  [
    "1.0",
    "Mathematics",
    "Introduction to basic arithmetic",
    "Understand basic mathematical operations",
    "Counting Fun With Friends"
  ],
  [
    "1.0",
    "Science",
    "Simple exploration of the world around them",
    "Spark interest in scientific principles",
    "Curious Kids Explore the World"
  ],
  [
    "1.0",
    "Social Studies",
    "Introduction to community roles and responsibilities",
    "Understand the role of community",
    "Our Friendly Neighborhood Helpers"
  ],
  [
    "1.0",
    "Physical Education",
    "Basics of movement and healthy habits",
    "Develop motor skills and healthy lifestyle",
    "Let's Get Moving!"
  ],
  [
    "1.0",
    "Art",
    "Introduction to colors, shapes, and creative expression",
    "Foster creativity",
    "Colors and Shapes All Around Us"
  ],
  [
    "1.0",
    "Music",
    "Basic understanding of rhythm and melody",
    "Introduction to music concepts",
    "Little Maestro's First Melodies"
  ],
  [
    "1.0",
    "Health",
    "Introduction to personal hygiene and safety",
    "Understand basics of personal health",
    "Staying Clean and Safe with Tommy"
  ],
  [
    "1.0",
    "Emotional Learning",
    "Recognizing and expressing feelings",
    "Develop emotional intelligence",
    "Feeling Big Emotions with Ellie"
  ],
  [
    "2.0",
    "Reading",
    "Increasing vocabulary, reading fluency and comprehension",
    "Develop advanced reading skills",
    "Amazing Animal Adventures"
  ],
  [
    "2.0",
    "Writing",
    "Writing more complex sentences and beginning paragraphs",
    "Improve writing skills",
    "Write Your Own Adventure Story"
  ],
  [
    "2.0",
    "Mathematics",
    "Addition and subtraction within 100, introduction to multiplication",
    "Deepen understanding of mathematical operations",
    "Solving Mysteries with Numbers"
  ],
  [
    "2.0",
    "Science",
    "Exploring living things, habitats, weather patterns",
    "Foster scientific curiosity",
    "Exploring Habitats: A Journey Around the World"
  ],
  [
    "2.0",
    "Social Studies",
    "Learning about history, geography, and citizenship in a local context",
    "Understand basic social studies concepts",
    "Our Town's Story: Past and Present"
  ],
  [
    "2.0",
    "Physical Education",
    "Building on movement skills, understanding games and teamwork",
    "Develop physical skills and cooperation",
    "Teamwork Makes the Dream Work: Sports Adventures"
  ],
  [
    "2.0",
    "Art",
    "Experimenting with different materials, basic art techniques",
    "Foster creativity and self-expression",
    "Creating Art with Everyday Things"
  ],
  [
    "2.0",
    "Music",
    "Learning about musical notation, rhythms, and instruments",
    "Deepen understanding of music concepts",
    "Musical Journeys: From Rhythms to Rhymes"
  ],
  [
    "2.0",
    "Health",
    "Building on personal hygiene concepts, basic understanding of nutrition",
    "Understand basics of personal health and nutrition",
    "The Healthy Heroes: Adventures in Nutrition"
  ],
  [
    "2.0",
    "Emotional Learning",
    "Identifying and managing a wider range of emotions",
    "Develop emotional intelligence",
    "Understanding My Feelings: A Guide for Kids"
  ],
  [
    "3.0",
    "Reading",
    "Reading comprehension, understanding narrative elements",
    "Improve reading skills and comprehension",
    "Journey Through Time: Stories from History"
  ],
  [
    "3.0",
    "Writing",
    "Writing structured paragraphs, introduction to essays",
    "Enhance writing skills",
    "Become an Author: Writing Your Own Short Stories"
  ],
  [
    "3.0",
    "Mathematics",
    "Multiplication and division, introduction to fractions",
    "Deepen understanding of mathematical operations",
    "The Secret of the Multiplying Mice"
  ],
  [
    "3.0",
    "Science",
    "Introduction to earth science, life cycles, simple physics",
    "Foster scientific curiosity and knowledge",
    "The Wondrous Life Cycle of Butterflies"
  ],
  [
    "3.0",
    "Social Studies",
    "Expanding knowledge of local and national history, geography",
    "Understand more complex social studies concepts",
    "Exploring Our Nation: A Kid's Guide to U.S. History"
  ],
  [
    "3.0",
    "Physical Education",
    "Broadening movement skills, introduction to specific sports",
    "Enhance physical skills and sportsmanship",
    "Fun with Fitness: Exploring New Sports"
  ],
  [
    "3.0",
    "Art",
    "More complex art projects, introduction to art history",
    "Foster creativity and self-expression",
    "Art Around the World: A Creative Journey"
  ],
  [
    "3.0",
    "Music",
    "Introduction to singing, more complex rhythm and melody work",
    "Deepen understanding of music concepts",
    "The Young Singer's Guide to Melodies and Songs"
  ],
  [
    "3.0",
    "Health",
    "Expanding knowledge on nutrition, introduction to human body systems",
    "Understand more complex health and nutrition concepts",
    "My Amazing Body: A Guide to How We Work"
  ],
  [
    "3.0",
    "Emotional Learning",
    "Managing complex emotions, introduction to empathy",
    "Develop emotional intelligence and empathy",
    "Walking in Someone Else's Shoes: Understanding Empathy"
  ],
  [
    "4.0",
    "Reading",
    "Deepening comprehension, analyzing texts, reading across different genres",
    "Enhance reading and critical analysis skills",
    "Discovering Genres: A Literary Adventure"
  ],
  [
    "4.0",
    "Writing",
    "Writing multi-paragraph essays, improving grammar and punctuation",
    "Improve writing skills and mechanics",
    "Super Grammar Heroes: Conquering the Written Word"
  ],
  [
    "4.0",
    "Mathematics",
    "Fractions and decimals, basic geometry, multi-digit multiplication and division",
    "Deepen understanding of mathematical concepts",
    "Adventures in Fraction Land"
  ],
  [
    "4.0",
    "Science",
    "Deeper exploration of earth science, introduction to physical science and biology",
    "Broaden scientific knowledge and understanding",
    "The Wonderful World of Weather: A Guide for Young Scientists"
  ],
  [
    "4.0",
    "Social Studies",
    "Studying state history and geography, understanding government systems",
    "Deepen understanding of social studies concepts",
    "Our State's Story: A Journey Through Time and Place"
  ],
  [
    "4.0",
    "Physical Education",
    "Refining movement skills, team games and activities",
    "Develop physical skills and team collaboration",
    "Mastering Movement: Games and Activities for Kids"
  ],
  [
    "4.0",
    "Art",
    "Understanding visual art principles, exploring art history",
    "Foster creativity and understanding of art principles",
    "Artists Throughout History: Discovering Their Secrets"
  ],
  [
    "4.0",
    "Music",
    "Introduction to music theory, exploring different music genres",
    "Broaden understanding of music and its diversity",
    "Music Explorer: A Journey Through Genres"
  ],
  [
    "4.0",
    "Health",
    "Learning about body systems, healthy habits, and physical changes",
    "Understand more about health and human body",
    "The Fantastic Journey Inside Your Body"
  ],
  [
    "4.0",
    "Emotional Learning",
    "Understanding conflict resolution, empathy, and social awareness",
    "Develop emotional intelligence and social skills",
    "Navigating Friendships: A Kid's Guide to Social Skills"
  ]
]`)
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
