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
	updateCover: (cover: Cover, options?: UpdateBookOptions) => void
	newImages: boolean
	setNewImages: (newImages: boolean) => void
	view: 'image' | 'hard' | 'paper'
}

const BackCoverImagePicker: React.FC<Props> = ({
	cover,
	book,
	updateCover,
	newImages,
	setNewImages,
	view,
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

	const id = 'backcover'
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
				<ImageDisplay newImages={newImages} image={cover.image.image} />
			</div>
		</>
	)
}

export default BackCoverImagePicker
