import { XIcon } from '@/components/Icons'
import Section from '@/components/Section'
import { Book } from '@/types'
import { BsDownload, BsUpload } from 'react-icons/bs'

interface Props {
	book: Book
	updateBook: (book: Book) => void
	setWarningMessage: (message: string) => void
}

const files = [
	{
		name: 'Hardcover Final',
		type: 'pdf',
	},
	{
		name: 'Softcover Final',
		type: 'pdf',
	},
	{
		name: 'Final Cover',
		type: 'pdf',
	},
]

const Upload: React.FC<Props> = ({ book, updateBook, setWarningMessage }) => {
	return (
		<div>
			<Section title="Upload">
				<Section.Center>
					<div className="flex w-full">
						<div className="card shadow-xl bg-base-100 w-full m-auto">
							<div className="card-body">
								<h1 className="text-2xl font-bold">Files</h1>
								<p className="text-lg">
									Upload any files associated with the book,
									such as the final PDF.
								</p>
								<input
									type="file"
									className="file-input file-input-bordered w-full max-w-xs my-6"
								/>

								<div className="flex w-full flex-col">
									{files.map((file) => (
										<div className="overflow-x-auto">
											<table className="table">
												<tbody>
													{/* row 1 */}
													<tr className="flex justify-end">
														<td className="mr-auto">
															{file.name}
														</td>
														<td className=" text-sm text-gray-400">
															{file.type}
														</td>
														<td>
															<button className="btn  btn-sm">
																<BsDownload
																	size={25}
																/>
															</button>
														</td>
														<td className="">
															<button className="btn  btn-sm text-red-500">
																<XIcon />
															</button>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</Section.Center>
				<Section.Right></Section.Right>
			</Section>
		</div>
	)
}

export default Upload
