import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

  if (posts.length === 0) return <p>No posts yet.</p>;

  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/${post.slug}`} className="post-link">
            {post.title}
          </Link>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.description && <p>{post.description}</p>}
        </li>
      ))}
    </ul>
  );
}
