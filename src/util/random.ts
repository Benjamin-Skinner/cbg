import { NUM_CHAPTERS } from '@/constants'
import random from 'random'

export function randomPageNumber() {
	return random.int(1, NUM_CHAPTERS)
}
