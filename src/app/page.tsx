import AllBooks from './AllBooks'

export const revalidate = 0
export default async function Home() {
	const res = await fetch(`${process.env.API_URL}/api/books`, {
		method: 'POST',
	})
	const { books } = await res.json()

	return (
		<main className="flex min-h-screen flex-col items-center justify-between px-12 ">
			<AllBooks books={books} />
		</main>
	)
}
