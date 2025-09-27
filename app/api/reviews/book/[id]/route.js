import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app', 'data', 'reviews.json');

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const json = await readJSON(dataPath);
    const reviews = json.reviews || [];
    const filtered = reviews.filter(r => r.bookId === id);
    return Response.json(filtered);
  } catch (err) {
    return Response.json({ error: 'Failed to read reviews' }, { status: 500 });
  }
}
