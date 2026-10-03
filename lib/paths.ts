/** Prefix a public asset path with the deploy base path (set for GitHub Pages). */
export const withBase = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
