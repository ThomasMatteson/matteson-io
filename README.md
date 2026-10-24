# matteson-io
MTECH website for matteson.io

Static multi-page site, no build step. Open `index.html` or serve the folder:

```sh
python3 -m http.server 8000
```

| Page | Purpose |
| --- | --- |
| `index.html` | Home: scroll reel, living model, lifecycle, invention, products, paths |
| `work.html` | The job: one service visit from three perspectives |
| `coworkers.html` | Digital coworkers |
| `wearables.html` | Field awareness |
| `process.html` | Process control |
| `onboarding.html` | Onboarding |
| `architecture.html` | Agentic architecture |
| `partner.html` | Partner / contact (form not yet connected) |

Shared styles and helpers live in `site.css` and `site.js`. The home page loads three.js r128 from cdnjs and falls back to a static hero without WebGL.

## Hosting

The site deploys to GitHub Pages at https://matteson.io from `main` via `.github/workflows/pages.yml`.

One-time setup:

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. At the domain registrar, point `matteson.io` at GitHub Pages:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record for `www`: `thomasmatteson.github.io`
3. Back in **Settings → Pages**, confirm the custom domain `matteson.io` and tick **Enforce HTTPS** once the certificate is issued.
