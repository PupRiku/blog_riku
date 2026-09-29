import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";

const POSTS_DIR = path.join(process.cwd(), "posts");

// A single lowercase URL segment: "my-post", "2026-recap".
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

// CORE_SCHEMA has no timestamp type, so dates stay as the literal strings
// written in the file instead of being coerced (and rolled over) by YAML.
const MATTER_OPTIONS = {
  engines: { yaml: (s: string) => (yaml.load(s, { schema: yaml.CORE_SCHEMA }) ?? {}) as object },
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  description?: string;
  tags: string[];
};

export type Post = PostMeta & { content: string };

function parseDate(value: unknown, file: string): string {
  const s = typeof value === "string" ? value : "";
  const m = DATE_RE.exec(s);
  // Reject values like 2026-02-30 that Date would silently roll over.
  const d = m && new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (!d || d.toISOString().slice(0, 10) !== s) {
    throw new Error(`Invalid or missing "date" in ${file}: expected YYYY-MM-DD, got ${JSON.stringify(value)}`);
  }
  return s;
}

// Only an omitted key (or a bare `key:`, which YAML reads as null) counts
// as absent; any value that is present must have the right type.
const isAbsent = (value: unknown) => value === undefined || value === null;

function invalid(field: string, file: string, expected: string, value: unknown): Error {
  return new Error(`Invalid "${field}" in ${file}: expected ${expected}, got ${JSON.stringify(value)}`);
}

function parseNonEmptyString(value: unknown, field: string, file: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw invalid(field, file, "a non-empty string (quote values like 1984 or yes)", value);
  }
  return value;
}

function parseSlug(value: unknown, file: string): string {
  const slug = isAbsent(value) ? file.replace(/\.mdx$/, "") : value;
  if (typeof slug !== "string" || !SLUG_RE.test(slug)) {
    throw invalid("slug", file, "lowercase letters, digits, and single hyphens", slug);
  }
  return slug;
}

function parseTags(value: unknown, file: string): string[] {
  if (isAbsent(value)) return [];
  if (!Array.isArray(value)) throw invalid("tags", file, "a list like [foo, bar]", value);
  return value.map((t) => parseNonEmptyString(t, "tags", file));
}

function readPostFile(file: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
  const { data, content } = matter(raw, MATTER_OPTIONS);
  return {
    slug: parseSlug(data.slug, file),
    title: parseNonEmptyString(data.title, "title", file),
    date: parseDate(data.date, file),
    description: isAbsent(data.description)
      ? undefined
      : parseNonEmptyString(data.description, "description", file),
    tags: parseTags(data.tags, file),
    content,
  };
}

function loadPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const posts = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map(readPostFile);

  const seen = new Set<string>();
  for (const p of posts) {
    if (seen.has(p.slug)) throw new Error(`Duplicate post slug: ${p.slug}`);
    seen.add(p.slug);
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

// Posts only change between builds, so read them once per process in
// production. In dev, re-read on every call so edits show up immediately.
let cached: { list: Post[]; bySlug: Map<string, Post> } | undefined;

function getPosts() {
  if (cached && process.env.NODE_ENV === "production") return cached;
  const list = loadPosts();
  cached = { list, bySlug: new Map(list.map((p) => [p.slug, p])) };
  return cached;
}

export function getAllPosts(): PostMeta[] {
  return getPosts().list.map(({ content: _content, ...meta }) => meta);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().bySlug.get(slug);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
