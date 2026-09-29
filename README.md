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
date: 2026-09-29          # required; add a time (2026-09-29T14:30) to order same-day posts
description: One-liner    # optional, used on index + meta tags
tags: [foo, bar]          # optional
image: /images/my-post.jpg # optional, see below
slug: custom-url          # optional, defaults to the filename
---

Content here. `<Callout>` and anything else in `components/mdx.tsx` is usable without importing.
```

`image` is the card image on the index page: a path under `public/` (starting with `/`) or a full `http(s)://` URL. It's cropped to fit to the card it lands in (2:1 for the newest post's hero card, 16:9 for the next two, 3:1 in the grid below), so keep the subject near the center. Posts without one get a solid brand-color block instead.

The index shows the 3 newest posts as featured cards and everything older in a smaller grid below.

## Layout

- `lib/posts.ts` reads and validates frontmatter (gray-matter) and sorts posts newest first
- `app/page.tsx` is the index, `app/[slug]/page.tsx` is a post (next-mdx-remote + rehype-pretty-code/shiki), statically generated
- `app/layout.tsx` is the shared header/footer shell. It also loads the fonts via `next/font/google`: Raleway 700 for the site title and h1–h3, Inter for body text (both fall back to system-ui)
- `app/globals.css` holds all styling, with light/dark colors as CSS variables on `:root`
- `components/Ads.tsx` holds the ad hooks. Set `NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-…` (in Vercel env vars) to load the AdSense script site-wide. `<AdSlot name="…"/>` marks unit positions (one is already at the bottom of posts). Both render nothing while the variable is unset.
