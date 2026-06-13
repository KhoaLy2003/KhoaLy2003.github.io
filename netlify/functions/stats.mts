import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async (req: Request) => {
  const url = new URL(req.url);
  const slug = url.searchParams.get("slug");
  const slugsParam = url.searchParams.get("slugs");

  if (slug) {
    const [views, stars] = await Promise.all([
      redis.get<number>(`views:${slug}`),
      redis.get<number>(`stars:${slug}`),
    ]);
    return Response.json({ views: views ?? 0, stars: stars ?? 0 });
  }

  if (slugsParam) {
    const slugs = slugsParam.split(",").filter(Boolean);
    if (slugs.length === 0) {
      return Response.json({});
    }
    const keys = slugs.flatMap((s) => [`views:${s}`, `stars:${s}`]);
    const values = await redis.mget<number[]>(...keys);
    const result: Record<string, { views: number; stars: number }> = {};
    slugs.forEach((s, i) => {
      result[s] = {
        views: values[i * 2] ?? 0,
        stars: values[i * 2 + 1] ?? 0,
      };
    });
    return Response.json(result);
  }

  return Response.json({ error: "missing slug or slugs param" }, { status: 400 });
};
