import React, { useState } from 'react'

import { DEFAULT_AR, FULL_PAGE_AR } from '@/constants'
import { ImageAR, Page } from '@/types'
import { UpdateBookOptions } from '@/app/book/[id]/Client'

interface Props {
	page: Page
	updatePage: (page: Page, options?: UpdateBookOptions) => void
}

const SelectPageLayout: React.FC<Props> = ({ page, updatePage }) => {
	const [previousImage, setPreviousImage] = useState<string | null>(null)
	const handleLayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const fullPage = e.target.checked

		// If fullPage has been toggled, clear the selected image
		let newImageUrl = page.image.image
		if (fullPage && page.layout !== 'fullPage') {
			if (previousImage) {
				newImageUrl = previousImage
			} else {
				newImageUrl = ''
			}
			setPreviousImage(page.image.image)
		} else if (!fullPage && page.layout === 'fullPage') {
			if (previousImage) {
				newImageUrl = previousImage
			} else {
				newImageUrl = ''
			}
			setPreviousImage(page.image.image)
		}

		const newImageAr: ImageAR = fullPage ? FULL_PAGE_AR : DEFAULT_AR

		updatePage(
			{
				...page,
				layout: fullPage ? 'fullPage' : 'imageFirst',
				image: {
					...page.image,
					image: newImageUrl,
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
