import Link from "next/link";
import { formatDate, getAllPosts, type PostMeta } from "@/lib/posts";

const FEATURED_COUNT = 3;
// Posts without an image get a solid block, cycling orange → purple → cyan.
const FALLBACKS = ["fallback-orange", "fallback-purple", "fallback-cyan"];

function PostCard({ post, index, size }: { post: PostMeta; index: number; size: "hero" | "featured" | "small" }) {
  const Heading = size === "small" ? "h3" : "h2";
  return (
    <article className={`card card-${size}`}>
      {post.image ? (
        // Plain <img>: images can be arbitrary remote URLs, which next/image would need allowlisted.
        <img className="card-media" src={post.image} alt="" loading={size === "hero" ? "eager" : "lazy"} />
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
              <li key={t}>#{t}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  const posts = getAllPosts();

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
