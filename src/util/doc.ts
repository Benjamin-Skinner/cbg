import { generateDoc as generateHard } from './doc/hard'
import { generateDoc as generateSoft } from './doc/soft'
import { Book } from '@/types'

export async function generateDoc(
	book: Book,
	version: string,
	filepath: string
) {
	if (version === 'hardcover') {
		await generateHard(book, version, filepath)
	} else {
		await generateSoft(book, version, filepath)
	}
}
