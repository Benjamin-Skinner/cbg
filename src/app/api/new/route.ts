import { NextResponse } from 'next/server'
import { createNewBook } from '@/functions/createNewBook'

export async function POST(request: Request) {
	const { title, description } = await request.json()

	if (!title) {
		return NextResponse.json(
			{ error: 'Title is required' },
			{
				status: 400,
			}
		)
	}

	const newBook = await createNewBook(title)
	return NextResponse.json(newBook, {
		status: 200,
	})
}
