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

export async function GET(request, { params }) {
  const { id } = params;
  const json = await readJSON(dataPath);
  const reviews = json.reviews || [];
  const review = reviews.find(r => r.id === id);
  if (!review) return Response.json({ error: 'Review not found' }, { status: 404 });
  return Response.json(review);
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await readJSON(dataPath);
    const reviews = json.reviews || [];
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return Response.json({ error: 'Review not found' }, { status: 404 });
    reviews[idx] = { ...reviews[idx], ...body };
    await writeJSON(dataPath, { reviews });
    return Response.json(reviews[idx]);
  } catch (err) {
    return Response.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const json = await readJSON(dataPath);
    const reviews = json.reviews || [];
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return Response.json({ error: 'Review not found' }, { status: 404 });
    const [removed] = reviews.splice(idx, 1);
    await writeJSON(dataPath, { reviews });
    return Response.json(removed);
  } catch (err) {
    return Response.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
