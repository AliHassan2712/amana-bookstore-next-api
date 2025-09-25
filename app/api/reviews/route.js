import reviews from "@/app/data/reviews.json";

export async function POST(request) {
  try {
    const body = await request.json(); // يقرأ الـ JSON من الطلب
    if (!body.bookId || !body.content || !body.reviewer) {
      return Response.json({ error: "Invalid review data" }, { status: 400 });
    }

    const newReview = {
      id: reviews.length + 1,
      ...body,
    };

    reviews.push(newReview); // هذه في الذاكرة فقط

    return Response.json(newReview, { status: 201 });
  } catch (error) {
    console.error(error); // سيطبع الخطأ في logs
    return Response.json({ error: "Failed to add review" }, { status: 500 });
  }
}
