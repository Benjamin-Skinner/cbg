'use client'

import { useEffect, Dispatch, SetStateAction, useState } from 'react'
import { SubjectCategory, SubjectOptions } from '@/types'
import { MdOutlineCastle, MdOutlineQuestionMark } from 'react-icons/md'
import { GiMaterialsScience } from 'react-icons/gi'
import { FaPaintBrush, FaHammer } from 'react-icons/fa'

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

	function classNames(subject: SubjectCategory) {
		return subject === options.subject
			? 'border bg-purple-400 border-black rounded-md h-24 w-32 flex items-center justify-center flex-col hover:bg-purple-500 transition-all duration-300 transform active:scale-90'
			: 'border bg-white border-black rounded-md h-24 w-32 flex items-center justify-center flex-col hover:bg-purple-500 transition-all duration-300 transform active:scale-90'
	}

	return (
		<div className="w-full">
			<div className="p-4">
				<div className="grid grid-cols-5 px-6">
					<button
						className={classNames('History')}
						onClick={() =>
							setOptions({
								...options,
								subject: 'History',
							})
						}
					>
						<MdOutlineCastle size={50} />
						<article className="text-center">History</article>
					</button>

					<button
						className={classNames('Science')}
						onClick={() =>
							setOptions({
								...options,
								subject: 'Science',
							})
						}
					>
						<GiMaterialsScience size={50} />

						<article className="text-center">Science</article>
					</button>
					<button
						className={classNames('Art')}
						onClick={() =>
							setOptions({
								...options,
								subject: 'Art',
							})
						}
					>
						<FaPaintBrush size={50} />
						<article className="text-center">Art</article>
					</button>
					{/* <button
						className={classNames('Career')}
						onClick={() =>
							setOptions({
								...options,
								subject: 'Career',
							})
						}
					>
						<FaHammer size={50} />

						<article className="text-center">Career</article>
					</button> */}
					<button
						className={classNames('Other')}
						onClick={() =>
							setOptions({
								...options,
								subject: 'Other',
							})
						}
					>
						<MdOutlineQuestionMark size={50} />
						<article className="text-center">Random</article>
					</button>

					{/* <label className="label cursor-pointer flex flex-col items-center text-center w-20">
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
										subject: 'History',
									})
								}
							/>
							<span className="label-text">
								Emotional Learning
							</span>
						</label> */}
				</div>
			</div>
		</div>
	)
}

export default Options
