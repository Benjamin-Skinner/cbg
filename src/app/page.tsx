import AllBooks from './AllBooks'

export const revalidate = 0
export default async function Home() {
	const res = await fetch(`${process.env.API_URL}/api/books`, {
		method: 'POST',
		headers: {
			'Cache-Control': 'no-cache, no-store, must-revalidate',
			Pragma: 'no-cache',
			Expires: '0',
		},
		cache: 'no-store', // Ensure that the response is not stored in any cache
		next: { revalidate: 0 }, // Next.js setting to disable ISR and always revalidate
	})
	const { books } = await res.json()

	return (
		<main className="flex min-h-screen flex-col items-center justify-between px-12 ">
			<AllBooks books={books} />
		</main>
	)
}
