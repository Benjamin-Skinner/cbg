/**
 * The container for all the image selection functionality.
 * Everywhere the user has an option to select an image, this component is used.
 *
 * ROLES:
 *
 * DISPLAY: If there is an image selected, show it. Otherwise, show a placeholder.
 * - placeholder and image should both have correct aspect ratio
 *
 */

import { PageImage } from '@/types'
import React from 'react'
import Display from './Display'
import ImageModal from './ImageModal'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

type ModalIdOptions =
	| 'backCover'
	| 'insideCover'
	| 'frontCover-hard'
	| 'frontCover-paper'
	| 'recallAndReflect1'
	| 'recallAndReflect2'
	| string

interface Props {
	image: PageImage
	updateImage: (image: PageImage, options?: UpdateBookOptions) => void
	modalId: ModalIdOptions
	bookId: string
	newImages: boolean
	setNewImages: (newImages: boolean) => void
	modalTitle?: string
	card?: boolean
}

const SelectImage: React.FC<Props> = ({
	image,
	updateImage,
	modalId,
	bookId,
	newImages,
	setNewImages,
	modalTitle,
	card = false,
}) => {
	const openModal = () => {
		// @ts-ignore
		document.getElementById(modalId).showModal()
		setNewImages(false)
	}
	return (
		<div className="flex items-center w-full justify-center">
			<Display
				image={image}
				newImages={newImages}
				openModal={openModal}
				card={card}
				// page={modalId === 'page'}
			/>
			<ImageModal
				modalId={modalId}
				image={image}
				updateImage={updateImage}
				uploadUrl={uploadApiRouteFromId(modalId, bookId)}
				deleteUrl={deleteApiRouteFromIds(modalId, bookId)}
				modalTitle={modalTitleFromModalId(modalId, modalTitle)}
			/>
		</div>
	)
}

export default SelectImage

function uploadApiRouteFromId(id: ModalIdOptions, bookId: string) {
	if (id === 'backCover') {
		return `/api/upload/back-cover?bookId=${bookId}`
	} else if (id === 'insideCover') {
		return `/api/upload/inside-cover?bookId=${bookId}`
	} else if (id === 'frontCover-hard') {
		return `/api/upload/front-cover-hard?bookId=${bookId}`
	} else if (id === 'frontCover-paper') {
		return `/api/upload/front-cover-paper?bookId=${bookId}`
	} else if (id === 'recallAndReflect1' || id === 'recallAndReflect2') {
		return `/api/upload/recall-and-reflect?bookId=${bookId}`
	} else {
		return `/api/upload/page?bookId=${bookId}&pageKey=${id}`
	}
}

function deleteApiRouteFromIds(id: ModalIdOptions, bookId: string) {
	if (id === 'backCover') {
		const endpoint = (url: string) =>
			`/api/delete/back-cover?bookId=${bookId}&url=${url}`
		return endpoint
	} else if (id === 'insideCover') {
		const endpoint = (url: string) =>
			`/api/delete/inside-cover?bookId=${bookId}&url=${url}`
		return endpoint
	} else if (id === 'frontCover-hard') {
		const endpoint = (url: string) =>
			`/api/delete/front-cover-hard?bookId=${bookId}&url=${url}`
		return endpoint
	} else if (id === 'frontCover-paper') {
		const endpoint = (url: string) =>
			`/api/delete/front-cover-paper?bookId=${bookId}&url=${url}`
		return endpoint
	} else if (id === 'recallAndReflect1' || id === 'recallAndReflect2') {
		const endpoint = (url: string) =>
			`/api/delete/recall-and-reflect?bookId=${bookId}&url=${url}`
		return endpoint
	} else {
		const endpoint = (url: string) =>
			`/api/delete/page?bookId=${bookId}&url=${url}&pageKey=${id}`
		return endpoint
	}
}

function modalTitleFromModalId(id: ModalIdOptions, title?: string) {
	if (title) {
		return title
	}
	if (id === 'backCover') {
		return 'Back Cover'
	} else if (id === 'insideCover') {
		return 'Inside Cover'
	} else if (id === 'frontCover-hard') {
		return 'Hardback Front Cover'
	} else if (id === 'frontCover-paper') {
		return 'Paperback Front Cover'
	} else if (id === 'recallAndReflect1' || id === 'recallAndReflect2') {
		return 'Recall and Reflect'
	} else return 'Image'
}
