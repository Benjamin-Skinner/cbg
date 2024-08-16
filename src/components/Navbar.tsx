import React from 'react'
import Link from 'next/link'
import TimeSince from './TimeAgo'
import { SavedIcon } from './Icons'
import { IoSaveOutline as SaveIcon } from 'react-icons/io5'

interface Props {
	lastSaved: number
	saving: boolean
	manualSave: () => void
}

const Navbar: React.FC<Props> = ({ lastSaved, saving, manualSave }) => {
	return (
		<div className="">
			<div className="navbar bg-transparent">
				<div className="flex-1">
					<Link href="/" className="btn btn-ghost text-xl">
						Children's Book Generator
					</Link>
				</div>
				<div className="flex-none transition-all duration-500 fixed right-0 bg-slate-200 z-50 py-0 h-fit items-center justify-center opacity-75 rounded-full">
					<div className="tooltip tooltip-bottom" data-tip="Save">
						<button
							className="btn btn-square btn-ghost text-gray-500"
							onClick={manualSave}
						>
							<SaveIcon size={5} />
						</button>
					</div>
					<div className="flex flex-row items-center mr-6 justify-start text-left w-40">
						{saving ? (
							<>
								<article className="prose italic text-sm px-2">
									<p className="italic text-xs text-gray-500">
										Saving
									</p>
								</article>
								<span className="loading loading-ring loading-md"></span>
							</>
						) : (
							<>
								<article className="prose">
									<p className="italic text-xs px-2 text-gray-500">
										Saved <TimeSince time={lastSaved} />
									</p>
								</article>
								<div className="text-gray-500">
									<SavedIcon size={5} />
								</div>
							</>
						)}
					</div>
					<button className="btn btn-square btn-ghost">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-5 h-5 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}

export default Navbar
