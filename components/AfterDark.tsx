"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AFTERDARK_KEY, type AfterDarkPref, isAfterDarkPref } from "@/lib/afterdark";

// The source of truth is data-afterdark on <html>, set before paint by the
// inline script in app/layout.tsx. CSS keys off it directly; these components
// read it through the hook below and write it through setPref.
const CHANGE_EVENT = "afterdark-change";

function applyPref(pref: AfterDarkPref) {
  const root = document.documentElement;
  root.dataset.afterdark = pref;
  delete root.dataset.afterdarkPrompt;
}

function readPref(): AfterDarkPref {
  const v = document.documentElement.dataset.afterdark;
  return isAfterDarkPref(v) ? v : "on";
}

export function setPref(pref: AfterDarkPref) {
  applyPref(pref);
  try {
    localStorage.setItem(AFTERDARK_KEY, pref);
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  // Keep other open tabs in sync
  function onStorage(e: StorageEvent) {
    if (e.key !== AFTERDARK_KEY || !isAfterDarkPref(e.newValue)) return;
    applyPref(e.newValue);
    onChange();
  }
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The saved preference, or null during server render and hydration. */
function useAfterDarkPref(): AfterDarkPref | null {
  return useSyncExternalStore(subscribe, readPref, () => null);
}

const OPTIONS: { value: AfterDarkPref; label: string; banner: string }[] = [
  { value: "on", label: "Hidden", banner: "Hide those posts" },
  { value: "hide-images", label: "Blur images", banner: "Show them, blur images" },
  { value: "off", label: "Shown", banner: "Show everything" },
];

/** Header control for changing the preference at any time. */
export function AfterDarkSelect() {
  const pref = useAfterDarkPref();
  return (
    <label className="afterdark-select" data-ready={pref === null ? undefined : ""} title="#AfterDark posts">
      <span className="afterdark-select-label">After Dark</span>
      <select value={pref ?? "on"} onChange={(e) => setPref(e.target.value as AfterDarkPref)}>
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/**
 * First-visit prompt. Always rendered; CSS shows it only while
 * data-afterdark-prompt is set, i.e. until any preference has been saved.
 */
export function AfterDarkBanner() {
  return (
    <aside className="afterdark-banner" aria-labelledby="afterdark-banner-title">
      <p id="afterdark-banner-title">
        Some posts here are tagged <strong>#AfterDark</strong> and have adult-adjacent content. How should they be
        handled?
      </p>
      <div className="afterdark-options">
        {OPTIONS.map((o) => (
          <button key={o.value} type="button" onClick={() => setPref(o.value)}>
            {o.banner}
          </button>
        ))}
      </div>
      <p className="afterdark-hint">You can change this any time from the After Dark menu in the header.</p>
      <button type="button" className="afterdark-close" aria-label="Dismiss and keep #AfterDark posts hidden" onClick={() => setPref("on")}>
        ×
      </button>
    </aside>
  );
}

/**
 * On an #AfterDark post: while the preference is "on", CSS hides the post and
 * this sends the reader to the index, which explains why.
 */
export function AfterDarkGate({ slug }: { slug: string }) {
  const pref = useAfterDarkPref();
  const router = useRouter();
  useEffect(() => {
    // The notice below handles scrolling; Next's own scroll-into-view can
    // land partway down the index because of its hidden duplicate list.
    if (pref === "on") router.replace(`/?hidden=${slug}`, { scroll: false });
  }, [pref, router, slug]);
  return null;
}

/** Index message after a redirect from a hidden post (/?hidden=slug). */
export function AfterDarkNotice({ posts }: { posts: { slug: string; title: string }[] }) {
  const params = useSearchParams();
  const pref = useAfterDarkPref();
  const router = useRouter();
  // Only slugs of real #AfterDark posts, so the message can't be spoofed
  const post = posts.find((p) => p.slug === params.get("hidden"));
  const shown = post !== undefined && pref !== null;
  useEffect(() => {
    if (shown) window.scrollTo(0, 0);
  }, [shown]);
  if (!shown) return null;

  function showWith(next: AfterDarkPref) {
    setPref(next);
    router.push(`/${post!.slug}`);
  }

  return (
    <aside className="afterdark-banner afterdark-notice" role="status">
      {pref === "on" ? (
        <>
          <p>
            <strong>{post.title}</strong> is currently hidden by your After Dark setting.
          </p>
          <div className="afterdark-options">
            <button type="button" onClick={() => showWith("hide-images")}>
              View it with images blurred
            </button>
            <button type="button" onClick={() => showWith("off")}>
              View it unfiltered
            </button>
          </div>
        </>
      ) : (
        <p>
          <Link href={`/${post.slug}`}>
            Continue to <strong>{post.title}</strong> →
          </Link>
        </p>
      )}
      <button type="button" className="afterdark-close" aria-label="Dismiss" onClick={() => router.replace("/", { scroll: false })}>
        ×
      </button>
    </aside>
  );
}

/**
 * Replaces markdown images in #AfterDark posts. Under "hide-images" CSS blurs
 * the image and shows the overlay button; revealing lasts until reload.
 */
export function AfterDarkImage(props: React.ComponentProps<"img">) {
  const [revealed, setRevealed] = useState(false);
  return (
    <span className="afterdark-media" data-revealed={revealed ? "" : undefined}>
      <img {...props} />
      {!revealed && (
        <button type="button" className="afterdark-reveal" onClick={() => setRevealed(true)}>
          <span>Tap to reveal image</span>
        </button>
      )}
    </span>
  );
}
