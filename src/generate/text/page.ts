import { Page, Book } from '@/types'
import StatusClass from '@/classes/Status'
import generateText from './openai'
import { getFullBookDescription } from '@/util/book'

async function generatePageText(
	book: Book,
	page: Page,
	intro: boolean,
	conclusion: boolean
): Promise<Page> {
	const newStatus = new StatusClass(page.text.status)
	try {
		const newPageText = await getPageText(page, book, intro, conclusion)
		console.log(newPageText)
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
	const prompt = `When I give you a subject and a book title, write a brief, short page about that subject for the educational, fact-based children's book. The page must be less than 75 words. Use simple language that is natural for reading aloud. Define any difficult words. Do not repeat the subject, just give me the text. Base it on the examples:

Book Title: Journey Through the Jungle
Subject: Tigers
Tigers are big cats that live in the jungle. Their fur is orange with dark stripes. These stripes help them hide in the tall grass. Tigers are super strong and can jump as high as a basketball hoop! They're excellent hunters with sharp teeth and claws, and they sneak up on their prey. They are also very good swimmers. Tigers like to take long naps too.

Book Title: Journey Through the Jungle
Subject: Elephants
Elephants are the largest land animals. They are so big, they could carry two cars on their back! They have long, strong trunks and big, floppy ears. An elephant uses its trunk for many different things. It helps them to pick up things, smell, and even drink water. Elephants love to splash and play in the water. They live together in groups and are very caring towards each other.

Book Title: Journey Through the Jungle
Subject: Crocodiles
Crocodiles are powerful animals. They have been around since the time of dinosaurs! Crocodiles are like living logs floating in the water. They can stay very still and quiet, waiting to catch fish or other animals. Their skin is tough and bumpy, like sandpaper. Crocodiles have big, strong jaws that snap shut. They live in rivers, lakes, and swamps. Crocodiles are excellent swimmers and can hold their breath underwater for a long time.

Book Title: Wonders of the World
Subject: Great Wall of China
The Great Wall of China is a giant wall that stretches over mountains and deserts. It's so long, it would take more than a year to walk its entire length! Built over 2,000 years ago, it was made to protect China from invaders. The wall is made of bricks and stones, and it's wide enough for two cars to drive side by side. People from all over the world visit the Great Wall.

Book Title: Wonders of the World
Subject: Eiffel Tower
The Eiffel Tower is a famous landmsark in Paris, France. It's made of iron and is as tall as an 81-story building! When it was built in 1889, it was the tallest man-made structure in the world. The tower has three levels for visitors to explore. At night, the Eiffel Tower lights up with thousands of twinkling lights. It was named after Gustave Eiffel, the engineer who designed it. Over 7 million people visit the Eiffel Tower every year.

Book Title: Journey Through the Jungle
Subject: Toucans
Toucans are colorful birds with big, bright beaks. Imagine if you had a nose as long as your arm. That's how long a toucan's beak is! They use it to reach fruits way up high in the trees. Toucans love to eat juicy fruits like watermelon and berries. They live in the rainforests and can fly really well. Toucans are like party guests with vibrant outfits and cheerful personalities!

Book Title: Journey Through the Jungle
Subject: Gorillas
Gorillas are gentle giants of the forest. They are the largest and strongest of all primates. Their fur is dark and thick, helping them to stay warm. Gorillas walk on their knuckles and have big, gentle hands, almost like ours! They live in families and take good care of each other. Gorillas mostly eat plants and fruits. They are shy and peaceful, loving to play and relax in the jungle.

Book Title: ${book.title}
Subject: ${page.title}`

	const text = await generateText(prompt)

	if (!text) {
		throw new Error('No text generated')
	}

	return text
}

async function getIntroText(page: Page, book: Book): Promise<string> {
	const prompt = `When I give you the title of a book, write an introductory page for the book in as close to 70 words as possible. Use simple words and phrases that are perfect for reading aloud. Base the introduction closely on the following examples. Only use human characters:

Title: Journey Through the Jungle
In a big green jungle, a family set up a cozy camp. They heard birds singing and leaves rustling all around. "Do you hear the jungle?" Dad asked with a smile. "Let's go explore and find its secrets!" The children came close, eager to start. They wanted to see what exciting creatures lived in the jungIe. They were ready for an adventure to discover some amazing animals.

Title: Wonders of the World
In a comfy living room, a family sat around a beautiful globe. "See these amazing places?" Grandma asked, her eyes twinkling. "Each incredible place has its own story." The children leaned in, eyes wide. They were ready to go on an adventure. They wanted to learn about the world's wonders and discover faraway places. They knew that every wonder would teach them something amazing about the world!

Title: Lets' Discover California
In a sunny backyard, a family sat around a big, colorful map. "Let's explore California!" Mom shouted. She pointed at different places and cities on the map. "We can see busy cities like Los Angeles and big trees in the north. There's a lot to see and do!" The kids jumped up and down. They were excited to find out about all the cool things in California.

Title: Mystery of the Moon
On a quiet night, a family gazed up at the glowing moon. "What secrets does the moon have?" Mom wondered aloud. The children looked up, curious and eager to find out. They imagined all sorts of mysteries waiting to be discovered. They were ready for an adventure to learn about the mystery of the moon and its hidden wonders.

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
