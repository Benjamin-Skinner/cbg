import PDFDocument from 'pdfkit'
import fs from 'fs'

export async function generatePdf(name: string) {
	const doc = new PDFDocument()

	doc.pipe(
		fs.createWriteStream(`
    ${name}.pdf`)
	)

	doc.end()
}
