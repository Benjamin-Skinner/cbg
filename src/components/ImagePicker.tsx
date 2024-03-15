'use client'

import React, { useRef, useState } from 'react'
import { UploadIcon } from './Icons'
import ImageCard from './ImageCard'
import ImageDisplay from './ImageDisplay'
import type { PutBlobResult } from '@vercel/blob'
import { Page } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	page: Page
	bookId: string
	backcover?: boolean
	updatePage: (page: Page, options?: UpdateBookOptions) => void
}

const ImagePicker: React.FC<Props> = ({
	page,
	bookId,
	updatePage,
	backcover = false,
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [loading, setLoading] = useState(false)

	const [currImageOptions, setCurrImageOptions] = useState(
		page.image.imageOptions
	)

	const selectImage = async (url: string) => {
		// Update the book on the client
		updatePage({
			...page,
			image: {
				...page.image,
				image: url,
			},
		})
	}

	const deleteImage = async (url: string) => {
		if (url === page.image.image) {
			return
		}
		// Immediately update the state
		const newImageOptions = currImageOptions.filter(
			(image) => image.url !== url
		)
		setCurrImageOptions(newImageOptions)

		// Update the book on the server
		await fetch(
			`/api/image/upload?page=${page.key}&bookId=${bookId}&url=${url}`,
			{
				method: 'DELETE',
			}
		)

		// Update the book on the client
		updatePage(
			{
				...page,
				image: {
					...page.image,
					imageOptions: newImageOptions,
				},
			},
			{ clientOnly: true }
		)
	}

	return (
		<>
			<div
				// @ts-ignore
				onClick={() => document.getElementById(page.key).showModal()}
				className="hover:transform hover:scale-105 transition-all duration-250 cursor-pointer"
			>
				<ImageDisplay backcover={backcover} image={page.image.image} />
			</div>
			<dialog id={page.key} className="modal w-5/6 m-auto">
				<div className="modal-box w-full max-w-full h-full">
					<div className="flex flex-row justify-between items-start ">
						<article className="prose">
							<h3>Select Image for "{page.title}"</h3>
						</article>
						<form
							onSubmit={async (event) => {
								setLoading(true)
								event.preventDefault()

								if (!inputFileRef.current?.files) {
									setLoading(false)
									throw new Error('No file selected')
								}

								const file = inputFileRef.current.files[0]

								const response = await fetch(
									`/api/image/upload?page=${page.key}&bookId=${bookId}`,
									{
										method: 'POST',
										body: file,
									}
								)

								const newBlob =
									(await response.json()) as PutBlobResult

								setCurrImageOptions(
									currImageOptions.concat({
										url: newBlob.url,
									})
								)
								// remove file
								inputFileRef.current.value = ''

								// Update book on client
								updatePage(
									{
										...page,
										image: {
											...page.image,
											imageOptions:
												currImageOptions.concat({
													url: newBlob.url,
												}),
										},
									},
									{ clientOnly: true }
								)

								setLoading(false)
							}}
						>
							{/* <label
								htmlFor="file"
								className="btn btn-ghost btn-sm m-auto mt-0"
							>
								Upload a file
								<UploadIcon size={6} />
							</label> */}
							<div className="flex flex-row">
								<input
									id="file"
									name="file"
									ref={inputFileRef}
									type="file"
									required
									className=""
								/>
								<button type="submit">Upload</button>
							</div>
						</form>

						<div className="modal-action mt-0">
							<form method="dialog">
								<button className="btn">Close</button>
							</form>
						</div>
					</div>
					<div className="grid grid-cols-3 pb-[700px] gap-y-14 pt-8 gap-x-8">
						{currImageOptions.map((image, index) => (
							<ImageCard
								selected={page.image.image === image.url}
								backcover={backcover}
								image={image}
								deleteImage={deleteImage}
								selectImage={selectImage}
							/>
						))}
						{loading ? (
							<ImageCard
								selected={false}
								backcover={backcover}
								placeholder
								deleteImage={deleteImage}
								selectImage={selectImage}
							/>
						) : null}
					</div>
				</div>
			</dialog>
		</>
	)
}

export default ImagePicker
