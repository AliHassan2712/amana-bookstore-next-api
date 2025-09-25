import books from "@/app/data/books.json";

// GET one book by ID
export async function GET(request, { params }) {
  const { id } = params;
  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return Response.json({ error: "Book not found" }, { status: 404 });
  }

  return Response.json(book);
}
