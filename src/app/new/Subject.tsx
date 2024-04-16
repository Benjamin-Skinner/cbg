'use client'
import * as React from 'react'
import { useState } from 'react'
import { Subject } from '@/types'

interface CardProps {
	subject: Subject
	selected: boolean
	onClick: () => void
}
const Card: React.FC<CardProps> = ({ subject, onClick, selected }) => {
	const [removed, setRemoved] = useState(false)

	if (removed) {
		return null
	}

	return (
		<div
			className={`card bg-white shadow-xl  hover:border-green-500 border-2 w-full cursor-pointer ${
				selected && 'border-green-500'
			}`}
			onClick={onClick}
		>
			<div className="card-body">
				<p className="card-title">{subject.title}</p>
				<p>{subject.oneLiner}</p>

				<div className="card-actions justify-end">
					{/* <button className="btn btn-primary" onClick={onClick}>
						Select
					</button> */}
					<div className="badge badge-secondary">
						Grade: {subject.options.grade}
					</div>
					<div className="badge badge-accent">
						{subject.options.subject}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Card
