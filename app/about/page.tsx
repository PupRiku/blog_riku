import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Riku",
};

// Standalone page, not a post: it isn't read from /posts, so it never shows up in the index.
export default function AboutPage() {
  return (
    <article>
      <header className="post-header">
        <h1>About</h1>
      </header>
      <div className="prose about-body">
        {/* Portrait placeholder. To use a real photo: put the file in /public, add
            `import Image from "next/image";` at the top, drop the fallback classes and aria-hidden,
            and put <Image src="/portrait.jpg" alt="…" fill sizes="12rem" /> inside. */}
        <div className="about-portrait card-fallback fallback-purple" aria-hidden="true" />
        <p>
          Placeholder intro paragraph. Who I am and what this blog is about. A few sentences here so
          the text runs long enough to wrap around the portrait on the right.
        </p>
        <p>
          Placeholder second paragraph. What I write about here, what I&apos;m into lately, and roughly
          how often new posts show up.
        </p>
        <p>Placeholder third paragraph. Where else to find me.</p>
      </div>
    </article>
  );
}
