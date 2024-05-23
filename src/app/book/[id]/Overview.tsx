import React from 'react'
import { Book } from '@/types'
import { UpdateBookOptions } from './Client'
import Section from '@/components/Section'

interface Props {
	book: Book
	updateBook: (book: Book, funcOptions?: UpdateBookOptions) => void
}

/*
    Status:
    - Completed - green
    - Not started - 
    - In Progress - 
    - Error - red

*/
const Overview: React.FC<Props> = ({}) => {
	return (
		<Section title="Overview">
			<Section.Center>
				<div className="card shadow-xl bg-base-100 w-3/4 space-y-8 m-auto">
					<article className="prose m-auto w-full h-full">
						<div className="w-full flex items-center justify-center mt-4">
							<div
								className="radial-progress text-primary"
								// @ts-ignore
								style={{ '--value': 25 }}
								role="progressbar"
							>
								12/37
							</div>
							<span className="text-primary text-xs uppercase font-semibold pl-3">
								steps Completed
							</span>
						</div>
						<div className="overflow-x-auto">
							<table className="table">
								{/* head */}
								<thead>
									<tr>
										<th>Group</th>
										<th>Section</th>
										<th>Status</th>
										<th>Generating</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td className="font-semibold">
											Description
										</td>
										<td>Softcover</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td></td>
										<td>Hardcover</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td className="font-semibold">Cover</td>
										<td>Front Cover</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td></td>
										<td>Back Cover</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td className="font-semibold">
											Chapters
										</td>
										<td>Intro</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td></td>
										<td>Page 1</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
									<tr>
										<td></td>
										<td>Conclusion</td>
										<td>Completed</td>
										<td>Not generating</td>
									</tr>
								</tbody>
							</table>
						</div>
					</article>
				</div>
			</Section.Center>
			<Section.Right></Section.Right>
		</Section>
	)
}

export default Overview
