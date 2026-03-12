     module.exports = {
       // ... other config
       logging: {
         level: 'info', // Change from 'error' to 'info' for more details
         fetches: {
           fullUrl: true,
         },
       },
     };
     ```
   - Rebuild and check console output for detailed build logs.

2. **Use `next build --debug`**:
   - Run `NEXT_PUBLIC_BASE_PATH=/your-base-path next build --debug` locally.
   - This provides additional debug information, including which pages are being processed and any errors.

3. **Check the Prerender Manifest**:
   - After a build, inspect `.next/prerender-manifest.json`.
   - This file lists all pre-rendered routes and their statuses. Look for missing routes or errors.

4. **Instrument the Build Process (Advanced)**:
   - If needed, add logging to `node_modules/next/dist/build/index.js` (e.g., console logs in key functions).
   - This is a last resort; avoid modifying node_modules directly in production. Instead, fork or patch if necessary.
   - Relevant GitHub issues: [vercel/next.js#27881](https://github.com/vercel/next.js/issues/27881) (discusses fallback blocking issues).

5. **Review Build Output**:
   - Check the `out/` directory after build for generated files.
   - Ensure all expected HTML files are present.

## Solutions

### How to Fix Fallback Values

- Change `fallback: "blocking"` to `fallback: false` in `getStaticPaths`.
- This ensures all pages are pre-generated at build time.
- Example:
  ```typescript
  export const getStaticPaths: GetStaticPaths = async () => {
    // Generate all paths
    const paths = /* your path generation logic */;
    return {
      paths,
      fallback: false, // Changed from 'blocking'
    };
  };
  ```
- If dynamic generation is needed, consider making the route client-side only (see below).

### How to Pre-Generate Paths

- In `getStaticPaths`, return an array of all possible paths based on your data source.
- For example, if using a `staticPages` object:
  ```typescript
  import { staticPages } from '@/static-pages';
  
  export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.keys(staticPages)
      .filter(path => !path.endsWith('/index')) // Exclude index pages
      .map(path => {
        const [, locale, slug] = path.split('/');
        return { params: { slug }, locale };
      });
    return { paths, fallback: false };
  };
  ```
- Ensure the paths match your route structure (e.g., `[slug]`).

### How to Handle Client-Side Only Routes

- For routes that can't be pre-generated (e.g., browse routes with infinite possibilities), add `getStaticPaths` with an empty paths array and `fallback: false`.
- Add `getStaticProps` returning empty props.
- Document that these routes rely on client-side routing.
- Example:
  ```typescript
  // Note: In static export mode, this route is client-side only.
  export const getStaticPaths = async () => ({
    paths: [],
    fallback: false,
  });
  
  export const getStaticProps = async () => ({
    props: {},
  });
  ```
- Use Next.js Router or Link for navigation.

## Testing

### Local Testing with NEXT_PUBLIC_BASE_PATH

- Set the environment variable and build:
  ```bash
  NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static
  ```
- This simulates the GitHub Pages build environment.

### Verifying the Output Directory

- After build, check `app/out/` (or your output directory).
- Ensure:
  - All HTML files for static pages are present.
  - Assets (CSS, JS, images) have correct paths (e.g., prefixed with base path).
  - No unexpected 404s or missing files.

### Testing with a Local Server

- Serve the output locally:
  ```bash
  cd app/out
  npx serve