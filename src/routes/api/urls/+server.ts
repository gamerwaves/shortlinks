import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db';
import { Url } from '$lib/server/models/Url';

export async function GET() {
  try {
    await connectDB();

    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .lean();

    return json(urls);
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
}
