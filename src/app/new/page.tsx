import Client from './Client'
import React from 'react'
import { getAllSubjects, getSavedSubjects } from '@/functions/getAllSubjects'

interface Props {}

const New: React.FC<Props> = async ({}) => {
	const subjects = await getAllSubjects()
	return (
		<main className="min-h-screen">
			<Client oldSubjects={subjects} />
		</main>
	)
}

export default New
