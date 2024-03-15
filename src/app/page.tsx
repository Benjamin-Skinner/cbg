import PllaceholderFullcover from '@/components/PlaceholderFullCover'
import TimeSince from '@/components/TimeAgo'
import { getAlllBooks } from '@/functions/getAllBooks'
import Link from 'next/link'
import AllBooks from './AllBooks'

export default async function Home() {
	const books = await getAlllBooks()
	return (
		<main className="flex min-h-screen flex-col items-center justify-between px-12 ">
			<AllBooks books={books} />
		</main>
	)
}
