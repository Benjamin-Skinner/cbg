'use client'

import { useEffect, Dispatch, SetStateAction, useState } from 'react'
import { SubjectOptions } from '@/types'

interface Props {
	options: SubjectOptions
	setOptions: Dispatch<SetStateAction<SubjectOptions>>
}

const Options: React.FC<Props> = ({ options, setOptions }) => {
	const [firstRender, setFirstRender] = useState(true)

	useEffect(() => {
		if (firstRender) {
			setFirstRender(false)
			return
		}
	}, [])

	return (
		<>
			<div className="flex flex-row ml-4">
				<div className="flex flex-row justify-center items-center">
					<div>
						<button
							className="btn btn-neutral btn-outline"
							// @ts-ignore
							onClick={() => window.options_modal.showModal()}
						>
							Change Subject and Grade
						</button>
						<div className="mt-2 flex flex-row justify-evenly items-center">
							<p className=" text-gray-500 text-sm">
								Subject: {options.subject}
							</p>
							<p className="ml-3 text-gray-500 text-sm">
								Grade: {options.grade}
							</p>
						</div>
					</div>
				</div>
			</div>
			<dialog id="options_modal" className="modal">
				<form
					method="dialog"
					className="modal-box w-[800px] max-w-none"
				>
					<h3 className="font-bold text-lg">Options</h3>
					<div className="flex flex-col">
						<div className="flex flex-row ml-8">
							<p className="mt-2 font-semibold mr-2">
								Grade Level:
							</p>
							<label className="label cursor-pointer flex flex-col items-center text-center w-14">
								<input
									type="radio"
									name="grade"
									className="accent-black radio-sm"
									checked={options.grade === 'All'}
									onChange={() =>
										setOptions({
											...options,
											grade: 'All',
										})
									}
								/>
								<span className="label-text">All</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-14">
								<input
									type="radio"
									name="grade"
									className="accent-black radio-sm"
									checked={options.grade === '1'}
									onChange={() =>
										setOptions({
											...options,
											grade: '1',
										})
									}
								/>
								<span className="label-text">1</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-14">
								<input
									type="radio"
									name="grade"
									className="accent-black radio-sm"
									checked={options.grade === '2'}
									onChange={() =>
										setOptions({
											...options,
											grade: '2',
										})
									}
								/>
								<span className="label-text">2</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-14">
								<input
									type="radio"
									name="grade"
									className="accent-black radio-sm"
									checked={options.grade === '3'}
									onChange={() =>
										setOptions({
											...options,
											grade: '3',
										})
									}
								/>
								<span className="label-text">3</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-14">
								<input
									type="radio"
									name="grade"
									className="accent-black radio-sm"
									checked={options.grade === '4'}
									onChange={() =>
										setOptions({
											...options,
											grade: '4',
										})
									}
								/>
								<span className="label-text">4</span>
							</label>
						</div>
						<div className="flex flex-row ml-8">
							<p className="mt-2 font-semibold mr-2">Subject:</p>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'All'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'All',
										})
									}
								/>
								<span className="label-text">All</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Reading'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Reading',
										})
									}
								/>
								<span className="label-text">Reading</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Writing'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Writing',
										})
									}
								/>
								<span className="label-text">Writing</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Mathematics'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Mathematics',
										})
									}
								/>
								<span className="label-text">Math</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Science'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Science',
										})
									}
								/>
								<span className="label-text">Science</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={
										options.subject === 'Social Studies'
									}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Social Studies',
										})
									}
								/>
								<span className="label-text">
									Social Studies
								</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={
										options.subject === 'Physical Education'
									}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Physical Education',
										})
									}
								/>
								<span className="label-text">
									Physical Education
								</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Art'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Art',
										})
									}
								/>
								<span className="label-text">Art</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Music'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Music',
										})
									}
								/>
								<span className="label-text">Music</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={options.subject === 'Health'}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Health',
										})
									}
								/>
								<span className="label-text">Health</span>
							</label>
							<label className="label cursor-pointer flex flex-col items-center text-center w-20">
								<input
									type="radio"
									name="subject"
									className="accent-black radio-sm"
									checked={
										options.subject === 'Emotional Learning'
									}
									onChange={() =>
										setOptions({
											...options,
											subject: 'Emotional Learning',
										})
									}
								/>
								<span className="label-text">
									Emotional Learning
								</span>
							</label>
						</div>
					</div>
					<div className="modal-action">
						{/* if there is a button in form, it will close the modal */}
						<button className="btn">Save</button>
					</div>
				</form>
			</dialog>
		</>
	)
}

export default Options
