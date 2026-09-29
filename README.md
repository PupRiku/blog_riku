# blog.riku.gay

Next.js (App Router) blog with posts as MDX files in the repo. Deployed on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Writing a post

Add `posts/<slug>.mdx`:

```mdx
---
title: My post            # required
date: 2026-09-29          # required
description: One-liner    # optional, used on index + meta tags
tags: [foo, bar]          # optional
slug: custom-url          # optional, defaults to the filename
---

Content here. `<Callout>` and anything else in `components/mdx.tsx` is usable without importing.
```

## Layout

- `lib/posts.ts` reads and validates frontmatter (gray-matter) and sorts posts newest first
- `app/page.tsx` is the index, `app/[slug]/page.tsx` is a post (next-mdx-remote + rehype-pretty-code/shiki), statically generated
- `app/layout.tsx` is the shared header/footer shell
- `components/Ads.tsx` holds the ad hooks. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` (in Vercel env vars) to load the AdSense script site-wide. `<AdSlot name="…"/>` marks unit positions (one is already at the bottom of posts). Both render nothing while the variable is unset.
