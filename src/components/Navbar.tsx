import React from 'react'
import Link from 'next/link'
import TimeSince from './TimeAgo'
import { SavedIcon } from './Icons'
import { IoSaveOutline as SaveIcon } from 'react-icons/io5'
import Image from 'next/image'
import Logo from '@/assets/logo.png'
import { BsArrowLeft } from 'react-icons/bs'

interface Props {
	lastSaved: number
	saving: boolean
	manualSave: () => void
}

const Navbar: React.FC<Props> = ({ lastSaved, saving, manualSave }) => {
	return (
		<div className="">
			<div className="navbar bg-transparent flex items-start ">
				<div className="flex-1">
					<Link
						href="/"
						className={`btn btn-ghost text-xl h-auto ${
							saving ? 'pointer-events-none' : ''
						}`}
					>
						<Image
							src={Logo}
							height={100}
							width={100}
							alt="Young and Bright Publishing logo"
						/>
						<div className="flex flex-row items-center justify-center">
							<BsArrowLeft size={25} />
							<h2 className="ml-3">Return home</h2>
						</div>
					</Link>
				</div>
				<div className="flex-none transition-all duration-500 fixed right-0 bg-slate-200 z-50 py-0 h-fit items-center justify-center opacity-75 rounded-full">
					<div className="tooltip tooltip-bottom" data-tip="Save">
						<button
							className="btn btn-square btn-ghost text-gray-500"
							onClick={manualSave}
						>
							<SaveIcon size={25} />
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
				</div>
			</div>
		</div>
	)
}

export default Navbar
