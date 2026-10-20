/** Prefix a public asset path with the deploy base path (empty on Vercel; set NEXT_PUBLIC_BASE_PATH only for a sub-path host). */
export const withBase = (p: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${p}`;
