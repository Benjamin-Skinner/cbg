import React from 'react'
import { Book, Page } from '@/types'
import ImagePicker from './ImagePicker'
import { motion } from 'framer-motion'

interface Props {
	page: Page
	updatePage: (page: Page) => void
	book: Book
	newImages: boolean
	setNewImages: (newImages: boolean) => void
}

const PageContent: React.FC<Props> = ({
	page,
	updatePage,
	book,
	newImages,
	setNewImages,
}) => {
	return (
		<SinglePageContent
			page={page}
			updatePage={updatePage}
			book={book}
			newImages={newImages}
			setNewImages={setNewImages}
		/>
	)
}

export default PageContent

const SinglePageContent: React.FC<Props> = ({
	page,
	updatePage,
	book,
	newImages,
	setNewImages,
}) => {
	// Image on top
	if (page.layout === 'imageFirst') {
		return (
			<div className="card w-7/12 m-auto aspect-hardcover bg-base-100 shadow-xl">
				<div className="card-body w-full">
					<div className="m-auto w-5/6 p-2 pb-8">
						<ImagePicker
							page={page}
							bookId={book.id}
							updatePage={updatePage}
							newImages={newImages}
							setNewImages={setNewImages}
						/>
					</div>

					<article className="prose flex text-md px-6 w-full mb-0 h-full ">
						<textarea
							value={page.text.content}
							onChange={(e) =>
								updatePage({
									...page,
									text: {
										...page.text,
										content: e.target.value,
									},
								})
							}
							className="w-full lam-anh text-center text-black"
						/>
					</article>
				</div>
			</div>
		)
	}

	if (page.layout === 'fullPage') {
		return (
			<div>
				<div className="flex flex-row items-center justify-center">
					<div className="card w-10/12 aspect-fullPage bg-base-100 shadow-xl">
						<div className="card-body w-full h-full">
							<ImagePicker
								page={page}
								bookId={book.id}
								updatePage={updatePage}
								newImages={newImages}
								setNewImages={setNewImages}
							/>
							<article className="prose m-auto text-md px-6 w-full h-full pt-3">
								<textarea
									value={page.text.content}
									onChange={(e) =>
										updatePage({
											...page,
											text: {
												...page.text,
												content: e.target.value,
											},
										})
									}
									className="w-full h-full lam-anh text-center text-black"
								/>
							</article>
						</div>
					</div>
				</div>
			</div>
		)
	} else {
		return (
			<div className="card w-7/12 m-auto aspect-hardcover bg-base-100 shadow-xl">
				<div className="card-body w-full">
					<article className="prose m-auto text-md px-6 w-full h-full mt-5">
						<textarea
							value={page.text.content}
							onChange={(e) =>
								updatePage({
									...page,
									text: {
										...page.text,
										content: e.target.value,
									},
								})
							}
							className="w-full h-full lam-anh text-center text-black"
						/>
					</article>

					<div className="m-auto w-5/6 p-2 pb-2">
						<ImagePicker
							page={page}
							bookId={book.id}
							updatePage={updatePage}
							newImages={newImages}
							setNewImages={setNewImages}
						/>
					</div>
				</div>
			</div>
		)
	}
}
