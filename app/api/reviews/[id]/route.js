import reviews from "@/app/data/reviews.json";

// GET one review by ID
export async function GET(request, { params }) {
  const { id } = params;
  const review = reviews.find((r) => r.id === parseInt(id));

  if (!review) {
    return Response.json({ error: "Review not found" }, { status: 404 });
  }

  return Response.json(review);
}
