# RezSource

RezSource is a static, mobile-first academic resource hub for Indigenous and rural students. It loads the five CSV collections in `data/` in the browser, normalizes their headers, and provides category pages plus a cross-dataset search.

## Run locally

Because browsers block `fetch()` from local files, serve the repository with any static server:

```bash
node server.js
```

Open <http://localhost:8000>.

## GitHub Pages

Push the repository to GitHub on the `main` branch. The included `.github/workflows/pages.yml` workflow publishes the repository root through GitHub Pages on every push and can also be started manually from the Actions tab.