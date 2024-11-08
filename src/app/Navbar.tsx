'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Book } from '@/types'
import Image from 'next/image'
import Logo from '@/assets/logo.png'

type NavProps = {}
export default function Nav({}: NavProps) {
	const [state, setState] = useState(false)

	const navigation = [
		{ title: 'Books', path: '/' },
		{ title: 'New Book', path: '/new' },
		{ title: 'Settings', path: '/settings' },
	]

	return (
		<nav className="rounded-lg mb-12 w-full border-b md:border-0">
			<div className="items-center px-4 w-full mx-auto md:flex md:px-8">
				<div className="flex items-center justify-between py-3 md:py-5 md:block">
					<Image
						src={Logo}
						height={100}
						width={100}
						alt="Young and Bright Publishing logo"
					/>
				</div>

				<div
					className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
						state ? 'block' : 'hidden'
					}`}
				>
					{/* <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
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
					</ul> */}
				</div>
				<div className="hidden md:inline-block">
					<Link href="/new" className="btn btn-large btn-primary">
						Create New Book
					</Link>
				</div>
			</div>
		</nav>
	)
}

interface Props {
	setCurrBooks: (books: Book[]) => void
	allBooks: Book[]
}

export const SearchBar: React.FC<Props> = ({ setCurrBooks, allBooks }) => {
	const [search, setSearch] = useState('')

	useEffect(() => {
		if (search === '') {
			setCurrBooks(allBooks)
			return
		}
		const filteredBooks = allBooks.filter((book) => {
			return book.title.toLowerCase().includes(search.toLowerCase())
		})
		setCurrBooks(filteredBooks)
	})
	return (
		<form className="max-w-md px-4 ml-8 mx-auto">
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
					value={search}
					onChange={(e) => {
						setSearch(e.target.value)
					}}
					type="text"
					placeholder="Search Books"
					className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
				/>
			</div>
		</form>
	)
}
