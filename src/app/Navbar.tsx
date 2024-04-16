'use client'

import { useState } from 'react'
import Link from 'next/link'

export default () => {
	const [state, setState] = useState(false)

	// Replace javascript:void(0) path with your path
	const navigation = [
		{ title: 'Books', path: '/' },
		{ title: 'New Book', path: '/new' },
		{ title: 'Settings', path: '/settings' },
	]

	return (
		<nav className="rounded-lg mb-12 w-full border-b md:border-0 md:static">
			<div className="items-center px-4 w-full mx-auto md:flex md:px-8">
				<div className="flex items-center justify-between py-3 md:py-5 md:block">
					<h2 className="text-xl font-bold">
						Children's Book Generator
					</h2>
				</div>
				<SearchBar />
				<div
					className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
						state ? 'block' : 'hidden'
					}`}
				>
					<ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
						{navigation.map((item, idx) => {
							return (
								<li
									key={idx}
									className="text-gray-600 hover:text-indigo-600"
								>
									<a href={item.path}>{item.title}</a>
								</li>
							)
						})}
					</ul>
				</div>
				<div className="hidden md:inline-block">
					<Link
						href="/new"
						className="py-3 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow"
					>
						New Book
					</Link>
				</div>
			</div>
		</nav>
	)
}

interface Props {}

const SearchBar: React.FC<Props> = ({}) => {
	return (
		<form
			onSubmit={(e) => e.preventDefault()}
			className="max-w-md px-4 ml-8 mx-auto"
		>
			<div className="relative">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="text"
					placeholder="Search"
					className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
				/>
			</div>
		</form>
	)
}
