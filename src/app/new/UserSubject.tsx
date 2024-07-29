import React, { useState, Dispatch, SetStateAction } from 'react'
import { Subject } from '@/types'
import RegenerateButton from './RegenerateButton'

interface Props {
	setSubjects: (addedSubjects: Subject[]) => void
	setError: Dispatch<SetStateAction<string>>
}

const UserSubject: React.FC<Props> = ({ setSubjects, setError }) => {
	const [prompt, setPrompt] = useState('')
	const [loading, setLoading] = useState(false)

	const regenerateSubjects = async () => {
		setLoading(true)
		const res = await fetch('/api/generate/subjects', {
			method: 'POST',
			body: JSON.stringify({
				options: {
					grade: 'All',
					subject: 'User',
				},
				prompt: prompt,
			}),
		})

		if (res.status !== 200) {
			const { error, code } = await res.json()
			console.error(error)
			setError(error)
			setLoading(false)
			return
		} else {
			const data = await res.json()
			// console.log(data)
			setSubjects(data.data)
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col">
			<textarea
				className="textarea textarea-bordered w-2/3 m-auto h-full"
				placeholder="Enter book prompt"
				value={prompt}
				onChange={(e) => setPrompt(e.target.value)}
			></textarea>
			<p className="text-gray-400 italic text-sm text-center my-4">
				Example: "A book about a veterinarian that helps readers to
				understand the day-to-day-life of a vet"
			</p>

			<RegenerateButton
				loading={loading}
				regenerateSubjects={regenerateSubjects}
			/>
		</div>
	)
}

export default UserSubject
