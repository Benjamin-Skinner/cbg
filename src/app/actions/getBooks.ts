'use server'

import { Book } from '@/types'
import { getAllBooks } from '@/functions/getAllBooks'

export async function getBooks(): Promise<Book[]> {
	const books = await getAllBooks()

	return books
}
