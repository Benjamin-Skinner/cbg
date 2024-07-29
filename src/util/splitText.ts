import { countWords } from './wordCount'

function splitText(text: string) {
	const words = countWords(text)
	const half = Math.ceil(words / 2)
	const firstHalf = text.split(' ').slice(0, half).join(' ')
	const secondHalf = text.split(' ').slice(half).join(' ')
	return { firstHalf, secondHalf }
}

export default splitText
