import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app', 'data', 'reviews.json');

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const json = await readJSON(dataPath);
  return Response.json(json.reviews || []);
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.bookId || !body.comment || !body.author) {
      return Response.json({ error: 'Invalid review data' }, { status: 400 });
    }
    const json = await readJSON(dataPath);
    const reviews = json.reviews || [];
    const id = `review-${Date.now()}`;
    const timestamp = new Date().toISOString();
    const newReview = { id, timestamp, ...body };
    reviews.push(newReview);
    await writeJSON(dataPath, { reviews });
    return Response.json(newReview, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Failed to add review' }, { status: 500 });
  }
}
