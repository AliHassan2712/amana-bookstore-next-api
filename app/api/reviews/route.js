import reviews from "@/app/data/reviews.json";

// GET all reviews
export async function GET() {
  return Response.json(reviews);
}

// POST new review
export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.bookId || !body.content || !body.reviewer) {
      return Response.json({ error: "Invalid review data" }, { status: 400 });
    }

    const newReview = {
      id: reviews.length + 1,
      ...body,
    };

    reviews.push(newReview); // ملاحظة: هذا فقط في الذاكرة، مش في ملف JSON

    return Response.json(newReview, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to add review" }, { status: 500 });
  }
}
