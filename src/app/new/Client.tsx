'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {}

const Client: React.FC<Props> = ({}) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const createBook = async () => {
		setLoading(true)

		try {
			// @ts-ignore
			const name = document.getElementById('book_name').value

			if (!name) {
				setLoading(false)
				return
			}

			const res = await fetch('/api/new', {
				method: 'POST',
				body: JSON.stringify({
					title: name,
				}),
			})

			const book = await res.json()

			router.push(`/book/${book.id}`)
		} catch (e: any) {
			console.error(e)
			setLoading(false)
		}
	}

	return (
		<div>
			<article className="prose">
				<h1>Create New Book</h1>
			</article>
			<div className="w-96 m-auto flex flex-col">
				<input
					id="book_name"
					type="text"
					placeholder="Book Name"
					className="input input-bordered w-full max-w-md"
				/>
				<button
					onClick={createBook}
					className="btn btn-primary mt-6 w-52"
				>
					{loading ? (
						<span className="loading loading-spinner loading-md"></span>
					) : (
						'Create'
					)}
				</button>
			</div>
		</div>
	)
}

export default Client
