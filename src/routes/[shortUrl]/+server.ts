import { redirect } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Url } from '$lib/server/models/Url';

export async function GET({ params }) {
  await connectDB();

  const urlDoc = await Url.findOne({ shortUrl: params.shortUrl });

  if (!urlDoc) {
    throw redirect(302, '/');
  }

  urlDoc.clicks += 1;
  await urlDoc.save();

  throw redirect(302, urlDoc.originalUrl);
}
