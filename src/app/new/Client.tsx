'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Options from './Options'
import { SubjectOptions, Subject } from '@/types'
import SubjectCard from './Subject'
import Error from './Error'
import Navbar from '../Navbar'
import UserSubject from './UserSubject'
import GenerateSubjects from './GenerateSubjects'
import { BiSolidSave } from 'react-icons/bi'

interface Props {
	oldSubjects: Subject[]
}

const Client: React.FC<Props> = ({ oldSubjects }) => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [showCurrent, setShowCurrent] = useState(true)

	const createBook = async (subject: Subject) => {
		setLoading(true)

		try {
			if (subject.title === '') {
				setLoading(false)
				return
			}
			const res = await fetch('/api/new', {
				method: 'POST',
				body: JSON.stringify({
					title: subject.title,
					oneLiner: subject.oneLiner,
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
			// console.log(book)
			router.push(`/book/${book.id}`)
		} catch (e: any) {
			setError(error)
			setLoading(false)
		}
	}

	const [subjects, setSubjects] = useState<Subject[]>(oldSubjects)
	const [filteredSubjects, setFilteredSubjects] =
		useState<Subject[]>(oldSubjects)

	useEffect(() => {
		console.log('subjects changed')
		if (showCurrent) {
			setFilteredSubjects(subjects.filter((subject) => subject.current))
		} else {
			setFilteredSubjects(subjects.filter((subject) => subject.saved))
		}
	}, [showCurrent, subjects])

	const onSave = async (id: string) => {
		console.log('save', id)
		const oldSubjects = subjects

		const newSubjects = subjects.map((subject) => {
			if (subject.id === id) {
				return { ...subject, saved: !subject.saved }
			}
			return subject
		})
		setSubjects(newSubjects)

		const res = await fetch('/api/subject/save', {
			method: 'POST',
			body: JSON.stringify({
				subjectId: id,
			}),
		})

		if (res.status !== 200) {
			const { error, code } = await res.json()
			console.error(error)
			setSubjects(oldSubjects)
			setError(error)
			return
		}
	}

	return (
		<div>
			<Navbar />
			<Error error={error} close={() => setError('')} />

			<div className="m-auto flex flex-row gap-x-8 px-8">
				<div className="w-1/2 card bg-base-200 shadow-xl">
					{/* <div className="flex flex-row"> */}
					<article className="prose p-4">
						<h2>Option 1: Subjects By Topic</h2>
					</article>
					{/* <button className="border ml-auto mr-10 h-min py-2 px-3 border-black rounded-md">
							<BiSolidSave />
						</button> */}
					{/* </div> */}
					<GenerateSubjects
						setSubjects={(allSubjects: Subject[]) => {
							setSubjects(allSubjects)
						}}
						setError={setError}
					/>
				</div>
				<div className="w-1/2 card bg-base-200 shadow-xl">
					<article className="prose p-6">
						<h2>Option 2: Manually Enter Subject</h2>
					</article>

					<UserSubject
						setSubjects={(allSubjects: Subject[]) => {
							setSubjects(allSubjects)
						}}
						setError={setError}
					/>
				</div>
			</div>
			{/* <div className="px-8"> */}
			{/* <div className="w-full card bg-base-200 shadow-xl h-24 mx-auto mt-6"> */}
			{/* <label className="label cursor-pointer">
				<span className="label-text">Show Saved</span>
				<input type="checkbox" className="toggle" checked />
			</label> */}
			{/* </div> */}
			{/* </div> */}
			<div className="flex flex-row space-x-3 my-12 mx-12">
				<button
					onClick={() => setShowCurrent(true)}
					className={
						showCurrent
							? 'badge badge-lg badge-neutral'
							: 'badge badge-lg badge-ghost badge-outline'
					}
				>
					Show Current
				</button>
				<button
					onClick={() => setShowCurrent(false)}
					className={
						!showCurrent
							? 'badge badge-lg badge-neutral'
							: 'badge badge-lg badge-ghost badge-outline'
					}
				>
					Show Saved
				</button>
				{/* <button className="badge badge-lg badge-ghost badge-outline">
					Show Category
				</button> */}
			</div>
			<div className="">
				<div className="grid grid-cols-4 gap-4 px-6">
					{filteredSubjects.map((subject, index) => (
						<SubjectCard
							subject={subject}
							key={subject.id}
							onClick={() => {
								createBook(subject)
							}}
							onSave={onSave}
						></SubjectCard>
					))}
				</div>
			</div>
		</div>
	)
}

export default Client
