/**
 * Canonical origin for the published showcase.
 *
 * `wrangler.jsonc` deploys this site to the Cloudflare Pages project
 * `9k-design-system`, which serves it on the custom domain below rather than on
 * its default `*.pages.dev` hostname.
 *
 * This is the only place the origin is written in code. Change it here and
 * nothing else: `sitemap.xml` is generated from it, and the two static files
 * that cannot import it are held in step by tests. `showcaseSitemap.test.ts`
 * checks the `Sitemap:` line in `showcase/public/robots.txt`, and
 * `showcaseLinkHeaders.test.ts` checks the `rel="canonical"` target in
 * `showcase/public/_headers`.
 *
 * No trailing slash; every entry in SITE_PAGES supplies its own leading one.
 */
export const SITE_URL = 'https://design.the9klabs.com';

/**
 * Every URL the published site actually serves, in sitemap order.
 *
 * The showcase is a single HTML document — its per-component sections are
 * `#section-*` anchors on that page rather than separate documents, and anchors
 * are not distinct URLs — so the only other entries are the two machine-readable
 * mirrors `prerender.mjs` writes beside it. Both are non-HTML, which the
 * sitemap protocol permits and which is the point here: they are what agent
 * crawlers should find.
 *
 * `robots.txt` and `sitemap.xml` are deliberately absent. A sitemap never lists
 * itself, and robots.txt is a crawl directive rather than content.
 */
export const SITE_PAGES = ['/', '/llms.txt', '/components.json'] as const;
