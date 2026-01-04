import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Url } from '$lib/server/models/Url';

export async function GET({ params }) {
  try {
    await connectDB();

    const urlDoc = await Url.findOne({ shortUrl: params.shortUrl });

    if (!urlDoc) {
      return json({ error: 'URL not found' }, { status: 404 });
    }

    return json(urlDoc);
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
}
