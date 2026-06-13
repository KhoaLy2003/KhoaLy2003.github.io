import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (req: Request) => {
  if (req.method !== "POST") {
    return Response.json({ error: "method not allowed" }, { status: 405 });
  }

  let slug: string | undefined;
  let action: "star" | "unstar" | undefined;
  try {
    ({ slug, action } = (await req.json()) as { slug?: string; action?: "star" | "unstar" });
  } catch {
    return Response.json({ error: "invalid request body" }, { status: 400 });
  }

  if (!slug || !action) {
    return Response.json({ error: "missing slug or action" }, { status: 400 });
  }

  let stars: number;
  if (action === "star") {
    stars = await redis.incr(`stars:${slug}`);
  } else {
    const current = (await redis.get<number>(`stars:${slug}`)) ?? 0;
    stars = current > 0 ? await redis.decr(`stars:${slug}`) : 0;
  }

  return Response.json({ stars });
};
