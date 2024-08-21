import AllBooks from './AllBooks'
import { getBooks } from './actions/getBooks'

export default async function Home() {
	const books = await getBooks()
	return (
		<main className="flex min-h-screen flex-col items-center justify-between px-12 ">
			<AllBooks books={books} />
		</main>
	)
}
