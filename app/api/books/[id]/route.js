import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app', 'data', 'books.json');

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
  const books = json.books || [];
  const book = books.find((b) => b.id === id);
  if (!book) return Response.json({ error: 'Book not found' }, { status: 404 });
  return Response.json(book);
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const json = await readJSON(dataPath);
    const books = json.books || [];
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return Response.json({ error: 'Book not found' }, { status: 404 });
    books[idx] = { ...books[idx], ...body };
    await writeJSON(dataPath, { books });
    return Response.json(books[idx]);
  } catch (err) {
    return Response.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const json = await readJSON(dataPath);
    const books = json.books || [];
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) return Response.json({ error: 'Book not found' }, { status: 404 });
    const [removed] = books.splice(idx, 1);
    await writeJSON(dataPath, { books });
    return Response.json(removed);
  } catch (err) {
    return Response.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
