import { useState } from 'preact/hooks';

interface Post {
  slug: string;
  title: string;
  description: string;
  publishDate: string;
  tags: string[];
}

interface Props {
  posts: Post[];
  allTags: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function TagFilter({ posts, allTags }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  const pillClass = (selected: boolean) =>
    `text-xs font-mono px-3 py-1 rounded border transition-colors cursor-pointer ${
      selected
        ? 'border-accent text-accent bg-surface'
        : 'border-edge text-dim hover:border-ink hover:text-ink'
    }`;

  return (
    <div>
      {/* Tag filter pills */}
      <div class="flex flex-wrap gap-2 mb-8">
        <button class={pillClass(active === null)} onClick={() => setActive(null)}>
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            class={pillClass(active === tag)}
            onClick={() => setActive(active === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <p class="text-dim text-sm">No posts with this tag yet.</p>
      ) : (
        <div class="space-y-3">
          {filtered.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} class="group block">
              <article class="border border-edge rounded-lg p-5 bg-surface hover:border-accent transition-colors">
                <div class="flex flex-wrap items-center gap-2 text-xs text-dim mb-2">
                  <time>{formatDate(post.publishDate)}</time>
                  {post.tags.slice(0, 4).map((t) => (
                    <span class="bg-canvas px-2 py-0.5 rounded font-mono border border-edge">{t}</span>
                  ))}
                </div>
                <h3 class="text-ink font-semibold group-hover:text-accent transition-colors mb-1">
                  {post.title}
                </h3>
                <p class="text-dim text-sm leading-relaxed">{post.description}</p>
              </article>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
