import { useState, useEffect } from 'preact/hooks';

interface Stats {
  views: number;
  stars: number;
}

interface Props {
  slug: string;
  interactive: boolean;
}

const storageKey = (slug: string) => `starred:${slug}`;

export default function BlogStats({ slug, interactive }: Props) {
  const [stats, setStats] = useState<Stats>({ views: 0, stars: 0 });
  const [starred, setStarred] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setStarred(localStorage.getItem(storageKey(slug)) === '1');
    } catch {}

    fetch(`/.netlify/functions/stats?slug=${slug}`)
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  async function toggleStar() {
    const action = starred ? 'unstar' : 'star';
    const nextStarred = !starred;

    // Optimistic update
    setStarred(nextStarred);
    setStats((s) => ({ ...s, stars: s.stars + (nextStarred ? 1 : -1) }));
    try {
      localStorage.setItem(storageKey(slug), nextStarred ? '1' : '0');
    } catch {}

    const res = await fetch('/.netlify/functions/star', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, action }),
    });

    if (!res.ok) {
      // Revert on failure
      setStarred(starred);
      setStats((s) => ({ ...s, stars: s.stars + (nextStarred ? -1 : 1) }));
      try {
        localStorage.setItem(storageKey(slug), starred ? '1' : '0');
      } catch {}
    } else {
      const { stars } = (await res.json()) as { stars: number };
      setStats((s) => ({ ...s, stars }));
    }
  }

  const starCount = loading ? '--' : String(stats.stars);
  const viewCount = loading ? '--' : String(stats.views);

  return (
    <span class="inline-flex items-center gap-3 text-sm text-dim font-mono">
      {interactive ? (
        <button
          onClick={toggleStar}
          aria-label={starred ? 'Unstar this post' : 'Star this post'}
          class={`inline-flex items-center gap-1 transition-colors ${
            starred ? 'text-accent' : 'hover:text-ink'
          }`}
        >
          {starred ? '★' : '☆'} {starCount}
        </button>
      ) : (
        <span class="inline-flex items-center gap-1">
          ☆ {starCount}
        </span>
      )}
      <span>·</span>
      <span>{viewCount} views</span>
    </span>
  );
}
