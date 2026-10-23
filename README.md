# matteson-io
MTECH website for matteson.io

Static multi-page site, no build step. Open `index.html` or serve the folder:

```sh
python3 -m http.server 8000
```

| Page | Purpose |
| --- | --- |
| `index.html` | Home: scroll reel, living model, lifecycle, invention, products, paths |
| `coworkers.html` | Digital coworkers |
| `wearables.html` | Field awareness |
| `process.html` | Process control |
| `onboarding.html` | Onboarding |
| `architecture.html` | Agentic architecture |
| `partner.html` | Partner / contact (form not yet connected) |

Shared styles and helpers live in `site.css` and `site.js`. The home page loads three.js r128 from cdnjs and falls back to a static hero without WebGL.
