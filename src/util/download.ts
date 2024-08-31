import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'

export async function servePng(imagePath: string, fileName: string) {
	// Read the image file from the filesystem
	const fileBuffer = await fs.readFile(imagePath)

	// Set headers to indicate file download
	const headers = new Headers()
	headers.set('Content-Type', 'image/png')
	headers.set('Content-Disposition', `attachment; filename=${fileName}`)

	// Return the response with the file buffer
	return new NextResponse(fileBuffer, {
		headers: headers,
	})
}

export async function serveWordDocument(filePath: string, fileName: string) {
	// Read the document file from the filesystem
	const fileBuffer = await fs.readFile(filePath)

	// Set headers to indicate file download
	const headers = new Headers()
	headers.set(
		'Content-Type',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	)
	headers.set('Content-Disposition', `attachment; filename=${fileName}`)

	// Return the response with the file buffer
	return new NextResponse(fileBuffer, {
		headers: headers,
	})
}
