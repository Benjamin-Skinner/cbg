// /**
//  * Used to upload an image file for a given page
//  *
//  * The onSubmit function should:
//  * 1. Set loading state
//  * 2. Send the file to the API endpoint
//  */

// import { UploadIcon } from './Icons'

// interface Props {
// 	onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
// 	inputFileRef: React.RefObject<HTMLInputElement>
// }

// const ImageUploadForm: React.FC<Props> = ({ onSubmit, inputFileRef }) => {
// 	return (
// 		<form onSubmit={onSubmit}>
// 			<div className="flex flex-row mr-auto ml-8">
// 				<input
// 					id="file"
// 					name="file"
// 					ref={inputFileRef}
// 					type="file"
// 					required
// 					className="max-w-56"
// 					accept="image/png, image/jpeg, image/webp"
// 				/>
// 				<button type="submit" className="btn btn-ghost btn-sm mt-0">
// 					Upload
// 					<UploadIcon size={6} />
// 				</button>
// 			</div>
// 		</form>
// 	)
// }

// export default ImageUploadForm
