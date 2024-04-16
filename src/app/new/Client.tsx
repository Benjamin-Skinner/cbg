'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Options from './Options'
import { SubjectOptions, Subject } from '@/types'
import SubjectCard from './Subject'
import Error from './Error'
import Navbar from '../Navbar'

interface Props {}

const Client: React.FC<Props> = ({}) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [generationLoading, setGenerationLoading] = useState(false)
	const [error, setError] = useState('')

	const [options, setOptions] = useState<SubjectOptions>({
		grade: 'All',
		subject: 'All',
	})

	const [selectedSubject, setSelectedSubject] = useState<Subject>({
		title: '',
		oneLiner: '',
		options: {
			grade: 'All',
			subject: 'All',
		},
		createdAt: Date.now(),
		batchNum: 0,
	})

	const [subjects, setSubjects] = useState<Subject[]>([])

	const regenerateSubjects = async () => {
		setGenerationLoading(true)
		const res = await fetch('/api/generate/subjects', {
			method: 'POST',
			body: JSON.stringify({
				options,
			}),
		})

		if (res.status !== 200) {
			const { error, code } = await res.json()
			console.error(error)
			setError(error)
			setGenerationLoading(false)
			return
		} else {
			const data = await res.json()
			console.log(data)
			setSubjects(data.data)
			setGenerationLoading(false)
			setSelectedSubject({
				title: '',
				oneLiner: '',
				options: {
					grade: 'All',
					subject: 'All',
				},
				createdAt: Date.now(),
				batchNum: 0,
			})
		}
	}

	const createBook = async () => {
		setLoading(true)

		try {
			if (selectedSubject.title === '') {
				setLoading(false)
				return
			}

			const res = await fetch('/api/new', {
				method: 'POST',
				body: JSON.stringify({
					title: selectedSubject.title,
					oneLiner: selectedSubject.oneLiner,
				}),
			})

			if (res.status !== 200) {
				const { error, code } = await res.json()
				console.error(error)
				setError(error)
				setLoading(false)
				return
			}

			const book = await res.json()
			console.log(book)

			router.push(`/book/${book.id}`)
		} catch (e: any) {
			setError(error)
			setLoading(false)
		}
	}

	return (
		<div>
			<Navbar />
			<Error error={error} close={() => setError('')} />

			<div className="m-auto flex flex-row">
				<div className="flex flex-row items-start gap-x-4 mt-8">
					<Options options={options} setOptions={setOptions} />
					<div className="space-y-2">
						<button
							className="btn btn-info"
							disabled={generationLoading}
							onClick={regenerateSubjects}
						>
							Generate Subjects
						</button>
						<div className="flex items-center justify-center w-full">
							{generationLoading ? (
								<div className="flex flex-row">
									<div className="badge badge-info badge-xl">
										Generating
									</div>
									<span className="loading loading-bars loading-md text-info ml-4"></span>
								</div>
							) : (
								<div className="flex flex-col">
									<div className="badge badge-neutral badge-xl">
										Waiting
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="ml-24 flex flex-row">
					<button
						onClick={createBook}
						disabled={selectedSubject?.title === ''}
						className="btn btn-primary mt-6 btn-lg"
					>
						{loading ? (
							<span className="loading loading-spinner loading-md"></span>
						) : (
							`Create ${
								selectedSubject ? selectedSubject.title : ''
							} ==>`
						)}
					</button>
					{/* <div className="h-full  flex items-end">
						<button className="btn btn-neutral btn-link text-gray-600">
							Start from scratch
						</button>
					</div> */}
				</div>
			</div>
			<div className="mt-24">
				<div className="grid grid-cols-4 gap-4 px-6">
					{subjects.map((subject, index) => (
						<SubjectCard
							subject={subject}
							key={index}
							selected={selectedSubject === subject}
							onClick={() => setSelectedSubject(subject)}
						>
							{/* <button
									className="btn btn-primary"
									onClick={() =>
										setContent(
											subject.title,
											subject.description
										)
									}
								>
									Select
								</button> */}
						</SubjectCard>
					))}
				</div>
			</div>
		</div>
	)
}

export default Client
