'use client'
import * as React from 'react'
import { useState } from 'react'
import { Subject } from '@/types'
import { IoStar, IoStarOutline } from 'react-icons/io5'
import { IoBookmark, IoBookmarkOutline } from 'react-icons/io5'

interface CardProps {
	subject: Subject
	onClick: () => void
	onSave: (id: string) => void
}
const Card: React.FC<CardProps> = ({ subject, onClick, onSave }) => {
	const [removed, setRemoved] = useState(false)
	const [loading, setLoading] = useState(false)

	if (removed) {
		return null
	}

	return (
		<div className="card bg-white shadow-xl w-full">
			<button
				onClick={() => onSave(subject.id!)}
				className="absolute shadow-lg right-2 top-2 badge h-12 w-12 hover:bg-gray-200"
			>
				{subject.saved ? (
					<IoBookmark size={20} />
				) : (
					<IoBookmarkOutline size={20} />
				)}
			</button>
			<div className="card-body ">
				<p className="card-title pr-10">{subject.title}</p>
				<p>{subject.oneLiner}</p>

				<div className="card-actions justify-end">
					<button
						className="btn hover:btn-primary w-full"
						onClick={() => {
							setLoading(true)
							onClick()
							// setLoading(false)
						}}
					>
						{loading ? (
							<span className="loading loading-dots loading-sm"></span>
						) : (
							'Create Book'
						)}
					</button>
					{/* <div className="flex flex-row justify-between w-full pt-3"> */}
					{/* <button className="">
							{<IoStar size={30} color="gold" />}
						</button> */}
					<div className="space-x-2">
						{/* <div className="badge badge-secondary">
							Grade: {subject.options.grade}
						</div> */}
						<div className="badge badge-accent">
							{subject.options.subject === 'User'
								? 'Manual Subject'
								: subject.options.subject}
						</div>
					</div>
					{/* </div> */}
				</div>
			</div>
		</div>
	)
}

export default Card
