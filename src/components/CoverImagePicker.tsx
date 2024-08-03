'use client'

import React, { useEffect, useRef, useState } from 'react'
import { UploadIcon, XIcon } from './Icons'
import ImageCard from './ImageCard'
import ImageDisplay from './ImageDisplay'
import type { PutBlobResult } from '@vercel/blob'
import { Cover, Book, ImageOption } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'
import { DEFAULT_AR } from '@/constants'

interface Props {
	cover: Cover
	book: Book
	backcover?: boolean
	updateCover: (cover: Cover, options?: UpdateBookOptions) => void
	newImages: boolean
	setNewImages: (newImages: boolean) => void
	transparent?: boolean
}

const CoverImagePicker: React.FC<Props> = ({
	cover,
	book,
	updateCover,
	backcover = false,
	newImages,
	setNewImages,
	transparent = false,
}) => {
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const [currImageOptions, setCurrImageOptions] = useState(
		cover.image.imageOptions
	)

	useEffect(() => {
		setCurrImageOptions(cover.image.imageOptions)
	}, [cover.image.imageOptions])

	const selectImage = async (option: ImageOption) => {
		// console.log('option', option)
		// Update the book on the client
		updateCover({
			...cover,
			image: {
				...cover.image,
				ar: option.ar,
				image: option.url,
			},
		})
	}

	const id = backcover ? 'backcover' : 'frontcover'
	return (
		<>
			<div
				// @ts-ignore
				onClick={() => {
					// @ts-ignore
					document.getElementById(id).showModal()
					setNewImages(false)
				}}
				className="hover:transform hover:scale-105 transition-all duration-250 cursor-pointer w-full h-full"
			>
				<ImageDisplay
					newImages={newImages}
					backcover={backcover}
					transparent={transparent}
					image={cover.image.image}
				/>
			</div>
			<dialog id={id} className="modal w-5/6 m-auto">
				<div className="modal-box w-full max-w-full h-full">
					<div className="flex flex-row items-start">
						<article className="prose">
							<h3>Select Image for {id}</h3>
						</article>

						<div className="modal-action mt-0 ml-auto">
							<form method="dialog">
								<button className="btn">Close</button>
							</form>
						</div>
					</div>
					<p
						className={`${
							error === '' ? 'invisible' : ''
						} text-red-400 italic`}
					>
						{error}
					</p>
					<div className="grid grid-cols-3 pb-[700px] gap-y-14 pt-4 gap-x-8">
						{currImageOptions
							.filter(
								(image) =>
									image.url !== '' && image.url !== null
							)
							.map((image, index) => (
								<ImageCard
									pageAr={image.ar}
									selected={
										cover.image.image === image.url &&
										image.url !== ''
									}
									image={image}
									deleteImage={() => null}
									selectImage={selectImage}
								/>
							))}
						{loading ? (
							<ImageCard
								pageAr={DEFAULT_AR}
								selected={false}
								placeholder
								deleteImage={() => {}}
								selectImage={selectImage}
							/>
						) : null}
					</div>
				</div>
			</dialog>
		</>
	)
}

export default CoverImagePicker
