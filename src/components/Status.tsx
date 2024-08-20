'use client'

import { Status as StatusT } from '@/types'
import { useEffect, useState } from 'react'

type Section = 'description' | 'frontcover' | 'text' | 'backcover'

interface Props {
	status: StatusT
	section?: Section
	showProgress?: boolean
	image?: boolean
}

const Status: React.FC<Props> = ({
	status,
	section,
	showProgress = false,
	image = false,
}) => {
	const getImageNum = (progress: number) => {
		if (progress < 40) {
			return 1
		} else if (progress < 60) {
			return 2
		} else if (progress < 80) {
			return 3
		} else return 4
	}
	if (status.generating.inProgress)
		return (
			<div className="flex flex-col">
				<div className="flex flex-col">
					<div className="flex flex-row">
						<div className="badge badge-info badge-xl">
							Generating
						</div>
						<span className="loading loading-bars loading-md text-info ml-4"></span>
					</div>
					<progress
						className="progress progress-info w-56 mt-2"
						value={status.generating.progress || 0}
						max="100"
					></progress>
				</div>

				<Message status={status} section={'description'} />
				{image && status.generating.progress === 100 ? (
					<p className="text-info text-sm mt-3">Saving images...</p>
				) : image ? (
					<p className="text-info text-sm mt-3">
						Image {getImageNum(status.generating.progress)}/4
					</p>
				) : (
					<></>
				)}
			</div>
		)
	else {
		return (
			<>
				<div className="flex flex-col w-full">
					{/* <div className="badge badge-neutral badge-xl">Waiting</div> */}
					<div className="w-full">
						<Message status={status} section={'description'} />
					</div>
				</div>
			</>
		)
	}
}

export default Status

// TODO: Implement this later; nonessential
async function updateDismissedInDB(section: Section) {
	console.log('UPDATING IN DB')
}

interface MessageProps {
	status: StatusT
	section: Section
}

const Message: React.FC<MessageProps> = ({ status, section }) => {
	const [dismissed, setDismissed] = useState<boolean>(
		status.message.dismissed
	)

	useEffect(() => {
		setDismissed(status.message.dismissed)
	}, [status.message.dismissed])

	const dismissError = async (section: Section) => {
		setDismissed(true)
		await updateDismissedInDB(section)
	}

	if (status.message.content === '') return <></>
	return (
		<>
			{status.message.dismissed || dismissed ? (
				<></>
			) : (
				<div
					role="alert"
					className={`mt-4 alert ${
						status.message.code === 'error'
							? 'alert-error'
							: 'alert-success'
					}`}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span className="w-3/4">{status.message.content}</span>
					<button
						onClick={() => dismissError(section)}
						className="btn btn-link text-gray-800 text-xs"
					>
						dismiss
					</button>
				</div>
			)}
		</>
	)
}
