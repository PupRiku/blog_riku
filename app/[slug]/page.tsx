import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { AdSlot } from "@/components/Ads";
import { AfterDarkGate, AfterDarkImage } from "@/components/AfterDark";
import { mdxComponents } from "@/components/mdx";
import { isAfterDarkPost, isAfterDarkTag } from "@/lib/afterdark";
import { formatDate, getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };

// Only slugs from /posts exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug((await params).slug);
  if (!post) notFound();
  const afterDark = isAfterDarkPost(post);

  return (
    // While After Dark is "on", CSS hides .afterdark-post and the gate redirects
    <article className={afterDark ? "afterdark-post" : undefined}>
      {afterDark && <AfterDarkGate slug={post.slug} />}
      <header className="post-header">
        <h1>{post.title}</h1>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.tags.length > 0 && (
          <ul className="tags">
            {post.tags.map((t) => (
              <li key={t} className={isAfterDarkTag(t) ? "tag-afterdark" : undefined}>
                #{t}
              </li>
            ))}
          </ul>
        )}
      </header>
      <div className="prose">
        <MDXRemote
          source={post.content}
          components={afterDark ? { ...mdxComponents, img: AfterDarkImage } : mdxComponents}
          options={{
            mdxOptions: {
              rehypePlugins: [
                [rehypePrettyCode, { theme: { light: "github-light", dark: "github-dark" } }],
              ],
            },
          }}
        />
      </div>
      <AdSlot name="post-bottom" />
    </article>
  );
}
