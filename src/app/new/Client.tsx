'use client'

interface Props {}

const Client: React.FC<Props> = ({}) => {
	const createBook = async () => {
		// @ts-ignore
		const name = document.getElementById('book_name').value

		console.log('name', name)

		await fetch('/api/new', {
			method: 'POST',
			body: JSON.stringify({
				title: name,
			}),
		})
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
					Create
				</button>
			</div>
		</div>
	)
}

export default Client
