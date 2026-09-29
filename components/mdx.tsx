import type { MDXComponents } from "mdx/types";

function Callout({ children }: { children: React.ReactNode }) {
  return <aside className="callout">{children}</aside>;
}

/** Components available inside every .mdx post without importing. */
export const mdxComponents: MDXComponents = {
  Callout,
};
