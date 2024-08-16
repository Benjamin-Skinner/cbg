import React, { useState } from 'react'

import { DEFAULT_AR, FULL_PAGE_AR } from '@/constants'
import { ImageAR, Page, SelectedImage } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	page: Page
	updatePage: (page: Page, options?: UpdateBookOptions) => void
}

const SelectPageLayout: React.FC<Props> = ({ page, updatePage }) => {
	const [previousImage, setPreviousImage] = useState<SelectedImage | null>(
		null
	)
	const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fullPage = e.target.checked

		// If fullPage has been toggled, clear the selected image
		let newImage: SelectedImage = {
			url: '',
			messageId: '',
			type: '',
		}

		// User has switched this from regular to full-page
		if (fullPage && page.layout !== 'fullPage') {
			// If we have stored an image from before, use that
			if (previousImage) {
				newImage = previousImage
			}
			// Save the full page image
			setPreviousImage(page.image.selected)
		}
		// User has switched this from full-page to regular
		else if (!fullPage && page.layout === 'fullPage') {
			// If we have stored an image from before, use that
			if (previousImage) {
				newImage = previousImage
			}
			// Save the nonfull page image
			setPreviousImage(page.image.selected)
		}

		const newImageAr: ImageAR = fullPage ? FULL_PAGE_AR : DEFAULT_AR

		updatePage(
			{
				...page,
				layout: fullPage ? 'fullPage' : 'imageFirst',
				image: {
					...page.image,
					selected: newImage,
					ar: newImageAr,
				},
			},
			{
				updateLayouts: true,
			}
		)
	}

	return (
		<div className="w-1/2">
			{/* <select
				className="select w-full max-w-xs"
				value={page.layout}
				defaultValue="imageFirst"
				onChange={handleLayoutChange}
			>
				<option value="imageFirst">Image on top</option>
				<option value="textFirst">Text on top</option>

				<option value="fullPage">Full page</option>
			</select> */}
			<div className="form-control">
				<label className="label cursor-pointer">
					<span className="label-text">Full-page</span>
					<input
						type="checkbox"
						className="toggle"
						checked={page.layout === 'fullPage'}
						onChange={(e) => handleLayoutChange(e)}
					/>
				</label>
			</div>
		</div>
	)
}

export default SelectPageLayout
