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
  try {
    ({ slug } = (await req.json()) as { slug?: string });
  } catch {
    return Response.json({ error: "invalid request body" }, { status: 400 });
  }
  if (!slug) {
    return Response.json({ error: "missing slug" }, { status: 400 });
  }

  const views = await redis.incr(`views:${slug}`);
  return Response.json({ views });
};
