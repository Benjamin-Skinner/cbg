// import { Book } from '@/types'

// export function getSampleBook(): Book {
// 	const book: Book = {
// 		id: '123',
// 		title: 'Journey Through the Jungle',
// 		description: {
// 			hardcover: {
// 				first: 'Embark on an exhilarating journey into the heart of the jungle, a place brimming with life and color. This book is a gateway for young adventurers to explore a world filled with awe-inspiring sights. Each page is an invitation to uncover the secrets of this vibrant ecosystem.',
// 				second: "This captivating book brings the jungle's diverse inhabitants to life, from the smallest insects to the grandest animals that tread its paths. Readers will be enthralled by the rich tapestry of life under the dense canopy, presented through stunning illustrations and fascinating facts.",
// 				third: 'Dive into the pages of this book and embark on an immersive journey through the jungle, where every step taken is an encounter with its daily marvels. This adventure beckons readers to uncover the hidden gems of this lush wilderness, promising a journey full of awe and discovery at every turn.',
// 			},
// 			softcover: {
// 				first: "Set off on a thrilling expedition into the jungle's heart, a realm teeming with vibrant life and colors. This book serves as a portal for young explorers to delve into a world of breathtaking sights and mysteries. Every page invites readers to discover the secrets of this dynamic ecosystem.",
// 				second: "Experience the jungle's diverse life, from tiny insects to majestic animals, through vivid illustrations and intriguing facts. This journey through the jungle is an immersive experience, offering encounters with its daily wonders. It's an adventure that promises awe and discovery, revealing the hidden treasures of this lush wilderness. Uncover the jungle!",
// 			},
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 		},
// 		outline: {
// 			pages: [
// 				{
// 					page: 'Tigers',
// 					locked: false,
// 					key: 'tiger',
// 				},
// 				{
// 					page: 'Monkeys',
// 					locked: false,
// 					key: 'monkey',
// 				},
// 				{
// 					page: 'Elephants',
// 					locked: false,
// 					key: 'elephant',
// 				},
// 				{
// 					page: 'Snakes',
// 					locked: false,
// 					key: 'snake',
// 				},
// 				{
// 					page: 'Parrots',
// 					locked: false,
// 					key: 'parrot',
// 				},
// 				{
// 					page: 'Crocodiles',
// 					locked: false,
// 					key: 'crocodile',
// 				},
// 				{
// 					page: 'Butterflies',
// 					locked: false,
// 					key: 'butterfly',
// 				},
// 				{
// 					page: 'Ants',
// 					locked: false,
// 					key: 'ant',
// 				},
// 				{
// 					page: 'Leopards',
// 					locked: false,
// 					key: 'leopard',
// 				},
// 				{
// 					page: 'Toucans',
// 					locked: false,
// 					key: 'toucan',
// 				},
// 				{
// 					page: 'Frogs',
// 					locked: false,
// 					key: 'frog',
// 				},
// 				{
// 					page: 'Chameleons',
// 					locked: false,
// 					key: 'chameleon',
// 				},
// 				{
// 					page: 'Gorillas',
// 					locked: false,
// 					key: 'gorilla',
// 				},
// 			],
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 		},
// 		recall: {
// 			activePages: ['tiger', 'monkey', 'elephant', 'snake', 'toucan'],
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 			questions: [
// 				{
// 					id: '1a',
// 					page: 'butterflies',
// 					selected: true,
// 					text: 'What do butterflies like to drink?',
// 					fromPage: true,
// 				},
// 				{
// 					id: '2a',
// 					page: 'leopards',
// 					selected: true,
// 					text: 'Where do leopards like to sleep during the day? ',
// 					fromPage: true,
// 				},
// 				{
// 					id: '3a',
// 					page: 'crocodiles',
// 					selected: true,
// 					text: "If you could touch a crocodile's skin, what would it feel like?",
// 					fromPage: true,
// 				},
// 				{
// 					id: '4a',
// 					page: 'parrots',
// 					selected: true,
// 					text: 'What can parrots do that people can also do?',
// 					fromPage: true,
// 				},
// 				{
// 					id: '5a',
// 					page: 'frogs',
// 					selected: true,
// 					text: 'What body part do frogs use to catch their food? ',
// 					fromPage: true,
// 				},
// 			],
// 		},
// 		reflect: {
// 			activePages: ['tiger', 'monkey', 'elephant', 'snake', 'toucan'],
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 			questions: [
// 				{
// 					id: '1b',
// 					page: '',
// 					selected: true,
// 					text: 'If you could be an animal from the jungle, who would you be?',
// 					fromPage: false,
// 				},
// 				{
// 					id: '2b',
// 					page: 'parrot',
// 					selected: true,
// 					text: 'Imagine if you were a parrot, what words would you want to learn to say?',
// 					fromPage: true,
// 				},
// 				{
// 					id: '3b',
// 					page: 'butterfly',
// 					selected: true,
// 					text: 'If you were a butterfly, what colors would you want your wings to be?',
// 					fromPage: true,
// 				},
// 				{
// 					id: '4b',
// 					page: 'ant',
// 					selected: true,
// 					text: 'If you were an ant, what big thing would you want to carry to your home?',
// 					fromPage: true,
// 				},
// 				{
// 					id: '5b',
// 					page: 'elephants',
// 					selected: true,
// 					text: 'If you could have a trunk like an elephant, what would you use it for?',
// 					fromPage: true,
// 				},
// 			],
// 		},
// 		frontCover: {
// 			ideas: {
// 				status: {
// 					error: false,
// 					generating: false,
// 					ready: true,
// 					waiting: false,
// 					progress: 100,
// 					message: '',
// 				},
// 				ideas: [
// 					'A beautiful picture of the majestic jungle',
// 					'An elephant walking through the jungle',
// 					'A tiger resting in a tree',
// 				],
// 			},
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 			image: '',
// 			imageOptions: [],
// 			prompt: 'Watercolor clip art of a beautiful picture of the majestic jungle. Hyperrealistic. Naturalistic.',
// 		},
// 		backCover: {
// 			ideas: {
// 				status: {
// 					error: false,
// 					generating: false,
// 					ready: true,
// 					waiting: false,
// 					progress: 100,
// 					message: '',
// 				},
// 				ideas: [
// 					'A beautiful picture of the majestic jungle',
// 					'An elephant walking through the jungle',
// 					'A tiger resting in a tree',
// 				],
// 			},
// 			status: {
// 				error: false,
// 				generating: false,
// 				ready: true,
// 				waiting: false,
// 				progress: 100,
// 				message: '',
// 			},
// 			image: '',
// 			imageOptions: [],
// 			prompt: 'Watercolor clip art of a beautiful picture of the majestic jungle. Hyperrealistic. Naturalistic.',
// 		},
// 		pages: {
// 			intro: {
// 				currPosition: 1,
// 				title: 'Introduction',
// 				key: 'intro',
// 				text: {
// 					status: {
// 						error: false,
// 						generating: false,
// 						ready: true,
// 						waiting: false,
// 						progress: 100,
// 						message: '',
// 					},
// 					content: `Deep in the heart of a lush, green jungle, a family set up their cozy campsite. All around, the air buzzed with the sounds of chirping birds and rustling leaves. "Do you hear the whispers of the jungle?" asked Dad, his eyes sparkling with excitement. "Let's explore and uncover the incredible wonders of this wonderful world." The children huddled closer, ready to embark on a journey through the fascinating jungle.`,
// 				},
// 				image: {
// 					status: {
// 						error: false,
// 						generating: false,
// 						ready: true,
// 						waiting: false,
// 						progress: 100,
// 						message: '',
// 					},
// 					image: 'https://cdn.midjourney.com/fcf70813-bae0-4879-841e-08ce3ee28c65/0_0.webp',
// 					imageOptions: [],
// 					prompt: 'A family setting up their campsite in front of a cabin in the jungle. Bonfire. Hyperrealistic. Naturalistic.',
// 				},
// 			},
// 			conclusion: {
// 				currPosition: 15,
// 				title: 'Conclusion',
// 				key: 'conclusion',
// 				text: {
// 					status: {
// 						error: false,
// 						generating: false,
// 						ready: true,
// 						waiting: false,
// 						progress: 100,
// 						message: '',
// 					},
// 					content: `As the jungle night wrapped around their campsite, the children's hearts were alive with what they just discovered about the jungle. They had wandered through leafy paths, discovering the wonders of this vibrant world. Each rustle in the leaves told a story of the jungle's diverse life. With eyes wide with amazement, they looked forward to more journeys, forever captivated by the endless marvels of the jungle.`,
// 				},
// 				image: {
// 					status: {
// 						error: false,
// 						generating: false,
// 						ready: true,
// 						waiting: false,
// 						progress: 100,
// 						message: '',
// 					},
// 					image: 'https://cdn.midjourney.com/b3ae478a-f205-4be5-a264-5a985d295ada/0_0.png',
// 					imageOptions: [],
// 					prompt: 'A family sitting in the jungle by a cabin. Stars in the sky. Bonfire. Hyperrealistic. Naturalistic.',
// 				},
// 			},
// 			chapters: [
// 				{
// 					title: 'Tigers',
// 					currPosition: 2,
// 					key: 'tiger',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Tigers are big cats that live in the jungle. Their fur is orange with dark stripes. These stripes help them hide in the tall grass. Tigers are super strong and can jump as high as a basketball hoop! They're excellent hunters with sharp teeth and claws, and they sneak up on their prey. They are also very good swimmers. Tigers like to take long naps too.",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: 'https://cdn.midjourney.com/59beecf9-ec5e-47d4-884d-8da5d0e3d047/0_2.webp',
// 						imageOptions: [],
// 						prompt: 'Watercolor clip art of a tiger resting in a tree. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Monkeys',
// 					currPosition: 3,
// 					key: 'monkey',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Monkeys are clever and playful creatures. They are our furry cousins in the animal kingdom. Monkeys have long tails, which are like their own personal balancing sticks when they swing from tree to tree. Monkeys live in big families and love to chatter with each other. Monkeys enjoy munching on fruits, just like we enjoy our favorite snacks. They make their homes in the treetops, where they feel safe and snug.',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a monkey in a tree. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Elephants',
// 					currPosition: 4,
// 					key: 'elephant',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Elephants are the largest land animals. They are so big, they could carry two cars on their back! They have long, strong trunks and big, floppy ears. An elephant uses its trunk for many different things. It helps them to pick up things, smell, and even drink water. Elephants love to splash and play in the water. They live together in groups and are very caring towards each other',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of an elephant. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Snakes',
// 					currPosition: 5,
// 					key: 'snakes',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Snakes are fascinating reptiles that slither on the ground. They don't have legs, but they can move very fast. Snakes come in many sizes and colors. Some are as small as a pencil, while others can be as long as a school bus! They use their tongues to smell and find food like mice and insects. Snakes don't chew. They swallow their food whole! Snakes are shy and often hide from people.",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a snake. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Parrots',
// 					currPosition: 6,
// 					key: 'parrot',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Parrots are colorful birds that love to talk and mimic sounds. Imagine having feathers as bright as a rainbow! Parrots can talk just like you! They can even copy the sound of your laughter or a ringing phone. Parrots have strong beaks that help them crack open nuts. They love to swing on branches and show off their fancy feathers. Parrots are social birds, and they enjoy chatting with their feathered friends',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a colroful parrot. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Crocodiles',
// 					currPosition: 7,
// 					key: 'crocodile',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Crocodiles are powerful animals. They have been around since the time of dinosaurs! Crocodiles are like living logs floating in the water. They can stay very still and quiet, waiting to catch fish or other animals. Their skin is tough and bumpy, like sandpaper. Crocodiles have big, strong jaws that snap shut. They live in rivers, lakes, and swamps. Crocodiles are excellent swimmers and can hold their breath underwater for a long time.',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of an elephant. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Butterflies',
// 					currPosition: 8,
// 					key: 'butterfly',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Butterflies are beautiful insects that live in the jungle. They start as tiny eggs, then hatch into caterpillars. These caterpillars munch on leaves. After a while, they wrap themselves in a cozy blanket called a chrysalis, just like you snuggle in your blanket at night. Inside, they transform into beautiful butterflies with colorful wings. Butterflies flutter from flower to flower, sipping nectar like a straw in a sweet drink.',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a majestic butterfly. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Ants',
// 					currPosition: 9,
// 					key: 'ants',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Ants are tiny, but they are incredibly strong and hardworking. Imagine being able to lift a car all by yourself. That's how strong ants are for their size! They live together in large groups called colonies. Each ant has a special job, like finding food, taking care of baby ants, or building the ant hill. They eat things like leaves, seeds, and even crumbs from your picnic. They work together to make their colony strong",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of colony of ants. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Leopards',
// 					currPosition: 10,
// 					key: 'leopard',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Leopards are big, wild cats with beautiful spotted coats. Each leopard's spots are unique, just like your fingerprints! They are strong and fast, able to run as fast as a car can drive! They are great hunters, eating meat from animals they catch. Leopards are mostly active at night and like to be alone. They live in forests, mountains, and grasslands. Leopards are very good at hiding, making them hard to see in the wild.",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a leopard. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Toucans',
// 					currPosition: 11,
// 					key: 'toucan',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Toucans are colorful birds with big, bright beaks. Imagine if you had a nose as long as your arm. That's how long a toucan's beak is! They use it to reach fruits way up high in the trees. Toucans love to eat juicy fruits like watermelon and berries. They live in the rainforests and can fly really well. Toucans are like party guests with vibrant outfits and cheerful personalities!",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of an toucan. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Frogs',
// 					currPosition: 12,
// 					key: 'frogs',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Frogs are amazing jumpers of the animal world. What if you could jump across an entire room in one jump? That's how far frogs can jump! They start their lives as tiny tadpoles in water, then grow legs and lungs to live on land. Frogs have smooth, wet skin that can be green, brown, or even brightly colored. They use their long, sticky tongues to catch bugs for dinner.",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of an elephant. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Chameleons',
// 					currPosition: 13,
// 					key: 'chameleon',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							"Chameleons are amazing reptiles that can change color. They can turn different shades of green, brown, and even blue! Imagine having clothes that change color with your mood. That's what chameleons can do with their skin. They have long, sticky tongues to catch insects like flies and caterpillars. Chameleons love to climb trees and use their tails like a fifth hand to hold on tight.",
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a chameleon. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 				{
// 					title: 'Gorillas',
// 					currPosition: 14,
// 					key: 'gorillas',
// 					text: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						content:
// 							'Gorillas are gentle giants of the forest. They are the largest and strongest of all primates. Their fur is dark and thick, helping them to stay warm. Gorillas walk on their knuckles and have big, gentle hands, almost like ours! They live in families and take good care of each other. Gorillas mostly eat plants and fruits. They are shy and peaceful, loving to play and relax in the jungle.',
// 					},
// 					image: {
// 						status: {
// 							error: false,
// 							generating: false,
// 							ready: true,
// 							waiting: false,
// 							progress: 100,
// 							message: '',
// 						},
// 						image: '',
// 						imageOptions: [],
// 						prompt: 'Watercolor of a gorilla. Hyperrealistic. Naturalistic.',
// 					},
// 				},
// 			],
// 		},
// 	}

// 	return book
// }
