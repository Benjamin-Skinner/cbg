// 'use client'
// import React, { useEffect, useRef, useState } from 'react'
// import Section from '@/components/Section'
// import Status from '@/components/Status'
// import { Book, Cover, PageImage } from '@/types'
// import CoverImagePicker from '@/components/CoverImagePicker'
// import { UpdateBookOptions } from '@/app/book/[id]/Client'
// import StatusClass from '@/classes/Status'
// import { IMAGE_POLL_TIME } from '@/constants'
// import { useInterval } from 'usehooks-ts'
// import {
// 	useGenerateImages,
// 	useUpdateImages,
// 	useUpdateImageIdeas,
// } from './functions/coverHooks'
// import { RefreshIcon } from '@/components/Icons'

// interface Props {
// 	book: Book
// 	updateBook: (book: Book) => void
// }

// const Frontcover: React.FC<Props> = ({ book, updateBook }) => {
// 	const [newImages, setNewImages] = useState(false)

// 	const { generateImages } = useGenerateImages(
// 		updateBook,
// 		book,
// 		book.frontCover,
// 		true,
// 		false
// 	)

// 	const { updateImages } = useUpdateImages(
// 		updateBook,
// 		book,
// 		book.frontCover,
// 		true,
// 		false,
// 		setNewImages
// 	)

// 	const { updateImageIdeas } = useUpdateImageIdeas(
// 		updateBook,
// 		book,
// 		book.frontCover,
// 		true,
// 		false
// 	)

// 	const setCoverImagePrompt = (prompt: string) => {
// 		const fullPrompt = `watercolor art of ${prompt.toLowerCase()} on a white background. Exciting. bright colors.`
// 		updateBook({
// 			...book,
// 			frontCover: {
// 				...book.frontCover,
// 				image: {
// 					...book.frontCover.image,
// 					prompt: {
// 						...book.frontCover.image.prompt,
// 						content: fullPrompt,
// 					},
// 				},
// 			},
// 		})
// 	}

// 	const cancelGeneration = () => {
// 		updateBook({
// 			...book,
// 			frontCover: {
// 				...book.frontCover,
// 				image: {
// 					...book.frontCover.image,
// 					status: {
// 						...book.frontCover.image.status,
// 						generating: {
// 							inProgress: false,
// 							progress: 0,
// 						},
// 					},
// 				},
// 			},
// 		})
// 	}

// 	useInterval(
// 		() => {
// 			// Your custom logic here
// 			if (book.frontCover.image.status.generating.inProgress) {
// 				console.log(`Polling for images for page front cover`)
// 				updateImages()
// 			}
// 		},
// 		// Delay in milliseconds or null to stop it
// 		IMAGE_POLL_TIME * 1000
// 	)

// 	return (
// 		<Section title="Front Cover">
// 			<Section.Center>
// 				<div className="card w-2/3 aspect-square bg-base-100 shadow-xl m-auto">
// 					<div className="card-body h-fullflex items-center justify-center">
// 						<CoverImagePicker
// 							cover={book.frontCover}
// 							book={book}
// 							updateCover={(cover: Cover) => {
// 								updateBook({
// 									...book,
// 									frontCover: cover,
// 								})
// 							}}
// 							newImages={newImages}
// 							setNewImages={setNewImages}
// 						/>
// 					</div>
// 				</div>
// 			</Section.Center>
// 			<Section.Right sectionName="frontcover">
// 				<Status
// 					section="frontcover"
// 					image
// 					status={book.frontCover.image.status}
// 				/>
// 				<div className="space-y-2 mt-4">
// 					<div className="flex flex-row items-center space-x-3">
// 						<article className="prose">
// 							<h4>Image Ideas:</h4>
// 						</article>
// 						<button
// 							className="btn btn-ghost btn-sm"
// 							onClick={updateImageIdeas}
// 						>
// 							{book.frontCover.imageIdeas.status.generating
// 								.inProgress ? (
// 								<span className="loading loading-dots loading-md"></span>
// 							) : (
// 								<RefreshIcon />
// 							)}
// 						</button>
// 						{book.frontCover.image.status.generating.inProgress && (
// 							<button
// 								className="btn btn-sm btn-outline ml-6"
// 								onClick={cancelGeneration}
// 							>
// 								Cancel
// 							</button>
// 						)}
// 					</div>
// 					<div className="flex flex-col space-y-2">
// 						{book.frontCover.imageIdeas.ideas.map((idea, index) => (
// 							<button
// 								key={index}
// 								className="badge badge-lg border-black border-1 hover:badge-neutral hover:text-white flex flex-1 text-left pl-4"
// 								onClick={() => {
// 									setCoverImagePrompt(idea.content)
// 								}}
// 							>
// 								{idea.content}
// 							</button>
// 						))}
// 					</div>
// 				</div>

// 				<textarea
// 					value={book.frontCover.image.prompt.content}
// 					disabled={
// 						book.frontCover.image.status.generating.inProgress
// 					}
// 					onChange={(e) =>
// 						updateBook({
// 							...book,
// 							frontCover: {
// 								...book.frontCover,
// 								image: {
// 									...book.frontCover.image,
// 									prompt: {
// 										...book.frontCover.image.prompt,
// 										content: e.target.value,
// 									},
// 								},
// 							},
// 						})
// 					}
// 					className="textarea h-48 w-full mt-2 leading-5"
// 				/>

// 				<button
// 					disabled={
// 						book.frontCover.image.status.generating.inProgress
// 					}
// 					onClick={generateImages}
// 					className="btn btn-info btn-wide mt-12"
// 				>
// 					Generate Images
// 				</button>
// 				{/* <button
// 					onClick={updateImages}
// 					className="btn btn-info btn-wide mt-12"
// 				>
// 					Update Images
// 				</button> */}
// 			</Section.Right>
// 		</Section>
// 	)
// }

// export default Frontcover
