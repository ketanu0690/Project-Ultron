# Earth Textures

Satellite imagery for `EarthGlobe`, `CloudLayer`, and ocean specular highlights.

Bundled assets (public domain — NASA Visible Earth / three.js examples):

- `day.jpg` — 2048×1024 equirectangular day map
- `night.png` — city lights night map
- `clouds.jpg` — cloud coverage map
- `specular.jpg` — ocean specular mask (bright = water)

The scene falls back to **procedural canvas textures** when these files are absent.

KTX2/Basis compression is recommended per `docs/performance/performance-budget.md` before shipping higher-resolution variants.
