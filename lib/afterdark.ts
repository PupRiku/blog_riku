// Shared by server and client code, so no Node or React imports here.

/**
 * - "on": #AfterDark posts are left off the index; direct links bounce to /
 * - "hide-images": everything listed, but images in #AfterDark posts are blurred
 * - "off": no filtering
 */
export type AfterDarkPref = "on" | "hide-images" | "off";

export const AFTERDARK_KEY = "afterdark-pref";
export const AFTERDARK_TAG = "afterdark";

export function isAfterDarkPref(value: unknown): value is AfterDarkPref {
  return value === "on" || value === "hide-images" || value === "off";
}

export function isAfterDarkTag(tag: string): boolean {
  return tag.toLowerCase() === AFTERDARK_TAG;
}

export function isAfterDarkPost(post: { tags: string[] }): boolean {
  return post.tags.some(isAfterDarkTag);
}

// Runs before first paint (see app/layout.tsx) so CSS can filter, blur, or
// show the first-visit prompt without a flash. With nothing saved, default to
// "on" and flag the prompt; if storage is blocked, default to "on" silently
// since a choice couldn't be saved anyway.
export const afterDarkInitScript = `try{var d=document.documentElement,a=localStorage.getItem("${AFTERDARK_KEY}");if(a==="on"||a==="hide-images"||a==="off")d.dataset.afterdark=a;else{d.dataset.afterdark="on";d.dataset.afterdarkPrompt=""}}catch(e){document.documentElement.dataset.afterdark="on"}`;
