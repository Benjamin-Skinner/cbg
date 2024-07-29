import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

const url = 'https://api.removal.ai/3.0/remove'

async function removeBg(imagePath: string) {
	console.log('removeBg')
	const apiKey = process.env.RM_API_KEY
	if (!apiKey) {
		throw new Error('RM_API_KEY is missing')
	}
	let data = new FormData()
	data.append('image_file', fs.createReadStream(imagePath))

	const res = await fetch(url, {
		method: 'POST',
		body: data,
		headers: {
			'Rm-Token': apiKey,
		},
	})
	// console.log(res)

	const json = await res.json()
	// console.log(json)
}

export default removeBg
