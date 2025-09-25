import books from "@/app/data/books.json";

// GET all books
export async function GET() {
  return Response.json(books);
}
