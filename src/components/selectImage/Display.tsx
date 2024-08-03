/**
 * Takes an image and an aspect ratio. If there is an image, it displaus it. Otherwise, it displays a placeholder.
 *
 * Must:
 * 1. check if there is an image
 * 2. handle if there is an error in the image loading (and then revert to placeholder)
 */

import { ImageAR, PageImage } from '@/types'
import React, { useState } from 'react'
import Image from 'next/image'
import PlaceholderImage from './Placeholder'
import NewImagesBanner from './NewImagesBanner'
import { arToBoolean } from '@/util/aspectRatio'

interface ContainerParentProps {
	children: React.ReactNode
	ar: ImageAR
}

const Container: React.FC<ContainerParentProps> = ({ children, ar }) => {
	const { square, fullPage, hardcover } = arToBoolean(ar)
	if (square) {
		return <SquareContainer>{children}</SquareContainer>
	}
	if (fullPage) {
		return <FullPageContainer>{children}</FullPageContainer>
	}
	if (hardcover) {
		return <HardcoverContainer>{children}</HardcoverContainer>
	}
}

interface ContainerProps {
	children: React.ReactNode
}

const SquareContainer: React.FC<ContainerProps> = ({ children }) => {
	return (
		<div
			className={`card bg-base-100 shadow-xl m-auto h-full w-3/4 hover:transform hover:scale-105 transition-all duration-250 cursor-pointer`}
		>
			{children}
		</div>
	)
}

const HardcoverContainer: React.FC<ContainerProps> = ({ children }) => {
	return (
		<div
			className={`card bg-base-100 shadow-xl m-auto aspect-hardcover h-[60%] hover:transform hover:scale-105 transition-all duration-250 cursor-pointer`}
		>
			{children}
		</div>
	)
}

const FullPageContainer: React.FC<ContainerProps> = ({ children }) => {
	return (
		<div
			className={`card bg-base-100 shadow-xl m-auto aspect-hardcover h-[60%] hover:transform hover:scale-105 transition-all duration-250 cursor-pointer`}
		>
			{children}
		</div>
	)
}

interface Props {
	image: PageImage
	newImages: boolean
}

const Display: React.FC<Props> = ({ image, newImages }) => {
	const [error, setError] = useState(false)

	const handleError = () => {
		setError(true)
	}

	return (
		<Container ar={image.ar}>
			{newImages && <NewImagesBanner />}
			<div className="card-body items-center justify-center">
				{error || !image.image ? (
					<Placeholder ar={image.ar} />
				) : (
					<DisplayImage image={image} handleError={handleError} />
				)}
			</div>
		</Container>
	)

	// if (error || !image.image) {
	// 	return <Placeholder ar={image.ar} />
	// } else {
	// 	return <DisplayImage image={image} handleError={handleError} />
	// }
}

export default Display

interface PlaceholderProps {
	ar: ImageAR
}

const Placeholder: React.FC<PlaceholderProps> = ({ ar }) => {
	return (
		<div className="w-full">
			<PlaceholderImage ar={ar} />
		</div>
	)
}

interface DisplayImageProps {
	image: PageImage
	handleError: () => void
}

const DisplayImage: React.FC<DisplayImageProps> = ({ image, handleError }) => {
	return (
		<Image
			src={image.image}
			alt="image"
			onError={handleError}
			className="rounded-lg object-cover m-auto"
			height={500}
			width={500}
		/>
	)
}
