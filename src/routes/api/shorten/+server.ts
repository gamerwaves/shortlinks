import { json } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { connectDB } from '$lib/server/db';
import { Url } from '$lib/server/models/Url';

export async function POST({ request }) {
  try {
    const { url, slug, tags } = await request.json();

    if (!url) {
      return json({ error: 'URL is required' }, { status: 400 });
    }

    await connectDB();

    // Use custom slug or generate one
    const shortUrl = slug?.trim() || nanoid(8);

    // Check for slug collision
    const existing = await Url.findOne({ shortUrl });
    if (existing) {
      return json(
        { error: 'Slug already in use' },
        { status: 409 }
      );
    }

    const urlDoc = await Url.create({
      originalUrl: url,
      shortUrl,
      tags: Array.isArray(tags) ? tags : []
    });

    return json(urlDoc);
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
}
