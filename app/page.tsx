import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AfterDarkNotice } from "@/components/AfterDark";
import { isAfterDarkPost, isAfterDarkTag } from "@/lib/afterdark";
import { formatDate, getAllPosts, type PostMeta } from "@/lib/posts";

const FEATURED_COUNT = 3;
// Posts without an image get a solid block, cycling orange → purple → cyan.
const FALLBACKS = ["fallback-orange", "fallback-purple", "fallback-cyan"];
// Rendered width of the image at each card size, so next/image picks a fitting file.
const SIZES = {
  hero: "(max-width: 40rem) 100vw, 40rem",
  featured: "(max-width: 40rem) 100vw, 20rem",
  small: "(max-width: 40rem) 100vw, 13rem",
};

function PostCard({ post, index, size }: { post: PostMeta; index: number; size: "hero" | "featured" | "small" }) {
  const Heading = size === "small" ? "h3" : "h2";
  return (
    <article className={`card card-${size}`} data-afterdark={isAfterDarkPost(post) ? "" : undefined}>
      {post.image ? (
        <div className="card-media">
          <Image
            src={post.image}
            alt=""
            fill
            sizes={SIZES[size]}
            // Never preload an #AfterDark cover: the index renders a hidden
            // unfiltered copy, and under the default setting it must not load.
            preload={size === "hero" && !isAfterDarkPost(post)}
            // Local images get resized and converted; remote URLs pass through as-is,
            // so any host works without allowlisting it in next.config.
            unoptimized={/^https?:\/\//.test(post.image)}
          />
        </div>
      ) : (
        <div className={`card-media card-fallback ${FALLBACKS[index % FALLBACKS.length]}`} aria-hidden="true" />
      )}
      <div className="card-body">
        <Heading className="card-title">
          <Link href={`/${post.slug}`} className="post-link">
            {post.title}
          </Link>
        </Heading>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.description && <p>{post.description}</p>}
        {post.tags.length > 0 && (
          <ul className="tags">
            {post.tags.map((t) => (
              <li key={t} className={isAfterDarkTag(t) ? "tag-afterdark" : undefined}>
                #{t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

function PostIndex({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p>No posts yet.</p>;

  const featured = posts.slice(0, FEATURED_COUNT);
  const rest = posts.slice(FEATURED_COUNT);

  return (
    <>
      <section className="featured" aria-label="Latest posts">
        {featured.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} size={i === 0 ? "hero" : "featured"} />
        ))}
      </section>
      {rest.length > 0 && (
        <section className="more-posts">
          <h2 className="section-heading">More posts</h2>
          <div className="card-grid">
            {rest.map((post, i) => (
              <PostCard key={post.slug} post={post} index={FEATURED_COUNT + i} size="small" />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default function Home() {
  const posts = getAllPosts();
  const afterDark = posts.filter(isAfterDarkPost);
  if (afterDark.length === 0) return <PostIndex posts={posts} />;

  // The page is static, so both versions are rendered and CSS shows the one
  // matching data-afterdark on <html>. Filtering the list (rather than hiding
  // cards) lets the next post take over the hero and featured slots.
  return (
    <>
      <Suspense>
        <AfterDarkNotice posts={afterDark.map(({ slug, title }) => ({ slug, title }))} />
      </Suspense>
      <div className="afterdark-filtered">
        <PostIndex posts={posts.filter((p) => !isAfterDarkPost(p))} />
      </div>
      <div className="afterdark-unfiltered">
        <PostIndex posts={posts} />
      </div>
    </>
  );
}
