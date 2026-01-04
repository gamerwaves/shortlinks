import { json } from '@sveltejs/kit'
import { connectDB } from '$lib/server/db'
import { Url } from '$lib/server/models/Url'

export async function PATCH({ params, request }) {
	await connectDB()
	const body = await request.json()

	const update: any = {}

	if (body.originalUrl) update.originalUrl = body.originalUrl
	if (Array.isArray(body.tags)) update.tags = body.tags

	if (body.shortUrl && body.shortUrl !== params.shortUrl) {
		const exists = await Url.findOne({ shortUrl: body.shortUrl })
		if (exists) {
			return json({ error: 'Slug already in use' }, { status: 409 })
		}
		update.shortUrl = body.shortUrl
	}

	const updated = await Url.findOneAndUpdate(
		{ shortUrl: params.shortUrl },
		update,
		{ new: true }
	)

	if (!updated) {
		return json({ error: 'URL not found' }, { status: 404 })
	}

	return json(updated)
}
