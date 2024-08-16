import { Page, Book, TextGenerationMode } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'
import { getFullBookDescription } from '@/util/book'

/**
 * Generate Page Text handles all of the text generation features for a page in a book.
 *
 * Based on the page type (intro/conclusiom/chapter) and the mode (generate/add/reduce/edit),
 * it calls the appropriate function and returns the updated page.
 *
 * No matter what it returns a complete page, but if there was an error the page
 * will have an error. NOTE: throwing an error here updates the page status
 * but does still sends a 200 response to the client.
 *
 */
async function generatePageText(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean,
	mode: TextGenerationMode
): Promise<Page> {
	const newStatus = new StatusClass(page.text.status)
	try {
		let newPageText = ''
		if (mode === 'generate') {
			newPageText = await getPageText(page, book, intro, conclusion)
		} else if (mode === 'add') {
			const extraSentence = await addSentence(page, book)
			newPageText = `${page.text.content} ${extraSentence}`
		} else if (mode === 'reduce') {
			newPageText = await reduceWords(page)
		} else if (mode === 'edit') {
			newPageText = await editText(page)
		}
		newStatus.setAsSuccess()
		return {
			...page,
			text: {
				content: newPageText,
				status: newStatus.toObject(),
			},
		}
	} catch (error: any) {
		newStatus.setError(error.message)
		newStatus.clearGenerating()
		return {
			...page,
			text: {
				...page.text,
				status: newStatus.toObject(),
			},
		}
	}
}

export default generatePageText

async function getPageText(
	page: Page,
	book: Book,
	intro: boolean,
	conclusion: boolean
): Promise<string> {
	if (intro) {
		return getIntroText(page, book)
	}
	if (conclusion) {
		return getConclusionText(page, book)
	}
	return getChapterText(page, book)
}

async function getChapterText(page: Page, book: Book): Promise<string> {
	const prompt = `When I give you a subject, book title, and intro to the book write a brief, short page about that subject for the educational, fact-based children's book. The page must be less than 75 words. Use simple language that is natural for reading aloud. Define any difficult words. Do not repeat the subject, just give me the text. The first subject should reference the introduction. Base it on the examples:

Book Title: Let's Discover California
Subject: Mt. Shasta
Intro: In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State. 
Page: Mom pointed to a tall, snowy mountain on the map. "That's Mount Shasta," she said. This mountain is a volcano! It is covered by snow, even in the summer. It's part of the Cascade Range and is over 14,000 feet tall! Mt. Shasta is a popular spot for hiking, camping, and enjoying beautiful views. It's a great place for adventurers who like nature and the outdoors!

Book Title: Let's Discover California
Subject: Sacramento
Intro: In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State. 
Page: "The capital of California is Sacramento," Mom explained, pointing to a spot on the map. Sacramento is a big city with lots of history. It's known for its beautiful parks and rivers. Sacramento is also home to the Capitol Building, where important decisions about the state are made. Sacramento has so much to explore. There are great museums, beautiful theaters, and delicious restaurants. 

Book Title: Let's Discover California
Subject: San Francisco
Intro: In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State. 
Page: Jack and Emma watched as their Mom pointed to another city in California. "That's San Francisco," she said. San Francisco is a beautiful city by the sea with a big red bridge called the Golden Gate Bridge. The city is famous for its steep hills and old-fashioned cable cars. It is home to many people from all over the world. San Francisco also has colorful houses that are very old.

Book Title: Let's Discover California
Subject: Hollywood
Intro: In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State. 
Page: "Look there!" Mom pointed to a special spot on the map. "That's Hollywood!" she said. Hollywood is a place in Los Angeles where movies and TV shows are made, which means that actors' dreams can come true. When you are in Hollywood, you might even see a famous movie star walking down the street! 

Book Title: Let's Discover California
Subject: Joshua Tree Park
Intro: In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State. 
Page: "Let's look at Joshua Tree Park!" Mom exclaimed. Joshua Tree Park is a desert in California with unique trees that look like they're reaching for the sky. These trees are called Joshua Trees and they have spikey leaves. The park is a great spot for camping and stargazing since it is really far from any cities. Lots of Coyotes and other animals live in Joshua Tree Park. 

Book Title: ${book.title}
Intro: ${book.pages.intro.text.content}
Subject: ${page.title}
Page:`

	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function getIntroText(page: Page, book: Book): Promise<string> {
	const prompt = `When I give you the title of a book, write an introductory page for the book in as close to 70 words as possible. Use simple words and phrases that are perfect for reading aloud. Base the introduction closely on the following examples. Only use human characters with creative names. There should be a parent and one or more children. Do not give the parent a name.:

Title: Lets' Discover California
In a sunny backyard, Emma, Jack, and their Mom sat with a colorful map spread out before them. "Let's explore California!" said Mom, pointing to different places in the state. "From the busy streets of Los Angeles and San Francisco to the towering redwoods and sunny beaches, there's so much to see." The children beamed with excitement, eager to discover all the amazing sights of the Golden State.


Title: ${book.title}`
	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function getConclusionText(page: Page, book: Book): Promise<string> {
	const prompt = `When I give you the title of a book and it's introduction, write an concluding page for the book in 70 words. Use simple words and phrases that are perfect for reading aloud. Base it closely on the following examples. Only use human characters:

Title: Journey Through the Jungle
Introduction: Deep in the heart of a lush, green jungle, a family set up their cozy campsite. All around, the air buzzed with the sounds of chirping birds and rustling leaves. "Do you hear the whispers of the jungle?" asked Dad, his eyes sparkling with excitement. "Let's explore and uncover the incredible wonders of this wonderful world." The children huddled closer, ready to embark on a journey through the fascinating jungle.
Conclusion: As the jungle night wrapped around their campsite, the children's hearts were alive with what they just discovered about the jungle. They had wandered through leafy paths, discovering the wonders of this vibrant world. Each rustle in the leaves told a story of the jungle's diverse life. With eyes wide with amazement, they looked forward to more journeys, forever captivated by the endless marvels of the jungle.

Title: Wonders of the World
Introduction: In the cozy living room of a small, warm house, a family gathered around a globe, spinning slowly on its stand. The walls were adorned with pictures of magnificent landmarks from all around the world. "Do you see these amazing places?" asked Grandma, her eyes twinkling with memories of her travels. "Each one has its own story, filled with history and mystery." The children leaned in, their eyes wide with curiosity, ready to embark on an imaginative journey to discover the wonders of the world.
Conclusion: The family's journey around the globe, from the comfort of their living room, filled the children with awe and inspiration. They traveled through stories, exploring ancient wonders and modern marvels alike. Each tale spun by Grandma brought the world's beauty closer, igniting their imaginations. As they looked at the globe, spinning gently, they dreamed of future adventures, ready to explore the endless wonders and stories our world holds. 

Title: ${book.title}
Introduction: ${book.pages.intro.text.content}
Conclusion:`
	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function addSentence(page: Page, book: Book) {
	if (page.text.content.length === 0) {
		throw new Error('Please start by generating some text.')
	}
	const prompt = `When I give you a subject, book title, and paragraph of an educational, fact-based children's book, add one high-quality sentence to the end of it. Use the same style as the previous sentences. Examples: 

Book Title: Let's Discover California
Subject: Mt. Shasta
Page: Mom pointed to a tall, snowy mountain on the map. "That's Mount Shasta," she said. This mountain is a volcano! It is covered by snow, even in the summer. It's part of the Cascade Range and is over 14,000 feet tall! Mt. Shasta is a popular spot for hiking, camping, and enjoying beautiful views.
New Sentence: It's a great place for adventurers who like nature and the outdoors!

Book Title: Let's Discover California
Subject: Sacramento
Page: "The capital of California is Sacramento," Mom explained, pointing to a spot on the map. Sacramento is a big city with lots of history. It's known for its beautiful parks and rivers. Sacramento is also home to the Capitol Building, where important decisions about the state are made. Sacramento has so much to explore. 
New Sentence: There are great museums, beautiful theaters, and delicious restaurants.

Book Title: Let's Discover California
Subject: San Francisco
Page: Jack and Emma watched as their Mom pointed to another city in California. "That's San Francisco," she said. San Francisco is a beautiful city by the sea with a big red bridge called the Golden Gate Bridge. The city is famous for its steep hills and old-fashioned cable cars. It is home to many people from all over the world. 
New Sentence: San Francisco also has colorful houses that are very old.

Book Title: ${book.title}
Subject: ${page.title}
Page: ${page.text.content}
New Sentence:`

	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function reduceWords(page: Page) {
	if (page.text.content.length === 0) {
		throw new Error('Please start by generating some text.')
	}
	const prompt = `When I give you a paragraph of an educational, fact-based children's book, reduce it by 10 words. Keep the text interesting, engaging, and educational. Use simple words and phrases that are perfect for reading aloud.
    
    Page: ${page.text.content}
    Reduced Page:`

	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function editText(page: Page) {
	if (page.text.content.length === 0) {
		throw new Error('Please start by generating some text.')
	}
	const prompt = `Take the following paragraph and edit it to make it more suitable for children. 1) Find any words or phrases that are too complex and simply them; 2) Remove any sentences that do not add any new factual information. Surround any edits with a '==' sign. Be conservative and only make at most 2 edits.
    Example:
    Text: Mom pointed to a small black insect crawling on the ground. "That's a beetle," she said. Beetles are insects with hard shells to protect their bodies. There are many different types of beetles, like ladybugs and scarab beetles. Some beetles fly, while others crawl. Beetles eat plants, fruits, and even other bugs. They are important for our environment because they help plants grow and keep other insect populations in check.
    Edited Text: Mom pointed to a small black insect crawling on the ground. "That's a beetle," she said. Beetles are insects with hard shells to protect their bodies. There are many different types of beetles, like ladybugs and scarab beetles. Some beetles fly, while others crawl. Beetles eat plants, fruits, and even other bugs. They are important for our environment because they help plants grow and keep other insect populations ==from getting too big==.

    Text: "Look at that caterpillar!" Mom pointed to a fuzzy creature crawling on a leaf. Caterpillars are baby insects that turn into beautiful butterflies or moths. They love to eat leaves and plants to grow big and strong. Caterpillars have many legs and move in a unique way by inching along. Some caterpillars even have bright colors to warn other animals that they taste bad. Isn't that interesting?
    Edited Text: "Look at that caterpillar!" Mom pointed to a fuzzy creature crawling on a leaf. Caterpillars are baby insects that turn into beautiful butterflies or moths. They love to eat leaves and plants to grow big and strong. Caterpillars have many legs and move in a unique way by inching along. Some caterpillars even have bright colors to warn other animals that they taste bad. == == 

    Text: ${page.text.content}
    Edited Text:`

	const text = await generateText(prompt)
	if (!text) {
		throw new Error('No text generated')
	}
	return text
}
