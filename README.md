# 3D Visualizer

An interactive 3D visualization tool for viewing and inspecting heavy machinery models in the browser.

## Features
- Interactive model inspection with `<model-viewer>`
- Part highlighting and camera presets
- Responsive UI and simple controls

## Tech Stack
- HTML, CSS, JavaScript
- `<model-viewer>` web component (glTF / GLB support)

## Live Demo
https://tryverse.space/projects/3d-visualizer

## Local development / Preview
1. From the project root run a simple HTTP server (recommended):

```bash
python -m http.server 8000
```

2. Open http://localhost:8000/index.html in your browser.

Notes:
- The sample GLB model is at `assets/models/JCB_1.glb`.
- Replace the canonical/JSON-LD URLs in `index.html` with your production URL.

## Deployment
- Upload all files to your static hosting provider (Netlify, Vercel, S3, etc.) and ensure the canonical URL in `index.html` matches the deployed location.

## Screenshots
(Add screenshots to the `screenshots/` folder and reference them here.)
