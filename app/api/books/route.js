import { promises as fs } from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'app', 'data', 'books.json');
const reviewsPath = path.join(process.cwd(), 'app', 'data', 'reviews.json');

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// GET all books, or filtered endpoints via query params:
// - /api/books?from=YYYY-MM-DD&to=YYYY-MM-DD  (date range)
// - /api/books?top=true  (top 10 by rating*reviewCount)
// - /api/books?featured=true
export async function GET(request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const json = await readJSON(dataPath);
  const books = json.books || [];

  if (params.get('top') === 'true') {
    const ranked = books.slice().sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
    return Response.json(ranked.slice(0, 10));
  }

  if (params.get('featured') === 'true') {
    return Response.json(books.filter(b => b.featured));
  }

  const from = params.get('from');
  const to = params.get('to');
  if (from && to) {
    const fromD = new Date(from);
    const toD = new Date(to);
    return Response.json(books.filter(b => {
      const pub = new Date(b.datePublished);
      return pub >= fromD && pub <= toD;
    }));
  }

  return Response.json(books);
}

// POST create a new book
export async function POST(request) {
  try {
    const body = await request.json();
    const json = await readJSON(dataPath);
    const books = json.books || [];
    const id = Date.now().toString();
    const newBook = { id, ...body };
    books.push(newBook);
    await writeJSON(dataPath, { books });
    return Response.json(newBook, { status: 201 });
  } catch (err) {
    return Response.json({ error: 'Failed to add book' }, { status: 500 });
  }
}
