import OpenAI from 'openai'

const openai = new OpenAI()

const generateText = async (prompt: string) => {
	console.log('Generating text with OpenAI')

	const completion = await openai.chat.completions.create({
		messages: [{ role: 'user', content: prompt }],
		model: 'gpt-3.5-turbo',
	})

	if (completion.choices.length === 0) {
		throw new Error('No completion choices returned')
	}

	if (!completion.choices[0].message) {
		throw new Error('No completion message returned')
	}

	return completion.choices[0].message.content as string
}

export default generateText
