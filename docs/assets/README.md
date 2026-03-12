# Assets

This directory contains visual assets for the Vizualni Admin documentation.

## Contents

- `architecture.svg` - Package architecture diagram

## Adding Screenshots

To add screenshots to the README:

1. Run the development server:

   ```bash
   yarn dev
   ```

2. Open the demos in your browser:
   - Modern API: http://localhost:3000/demos/modern-api
   - Playground: http://localhost:3000/demos/playground-v2

3. Take screenshots using your preferred tool:
   - macOS: Cmd+Shift+4
   - Windows: Win+Shift+S
   - Linux: gnome-screenshot or Flameshot

4. Save screenshots here:
   - `docs/assets/screenshot-modern-api.png`
   - `docs/assets/screenshot-playground.png`
   - `docs/assets/screenshot-gallery.png`

5. Add to README:
   ```markdown
   ![Modern API Demo](docs/assets/screenshot-modern-api.png)
   ```

## Recommended Screenshot Sizes

- Chart demos: 800x400 px
- Full page: 1280x720 px
- Thumbnails: 400x200 px
