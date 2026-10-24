# Findora — Lost & Found, Matched

A responsive, single-file frontend prototype for a campus lost-and-found service. The app has no build step and keeps its source at the repository root so GitHub Pages can serve it directly.

## Run locally

Open `index.html` in a modern browser. The app is self-contained and does not require a package install or a network connection. Draft autosave uses browser storage when available and falls back to memory for the current tab.

## Included prototype flows

- Report a lost or found item using a four-step guided form, with priority and a private ownership detail.
- Explore sample listings with keyword, type, category, time, campus place, status, and priority filters.
- Browse the campus map demo and its street-level preview.
- Review explainable match scores across category, appearance, location, timeline, text, and urgency.
- Walk through private claims, verified chat examples, handover codes, pickup windows, optional rewards, and ratings.
- Select from 14 interface languages. Sample listings and user-entered descriptions remain in their submitted language.

## Publish with GitHub Pages

1. Add `index.html`, `README.md`, and `.nojekyll` to the root of the existing Round 2 repository.
2. Push the changes to the repository’s existing branch. Keep the project in the same repository for every checkpoint.
3. In GitHub, open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select the branch and **/(root)**, then save.
4. Wait for the Pages deployment to finish and copy the HTTPS URL shown in the repository’s Pages settings into the final submission.

GitHub’s publishing instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Demo limitations

The listings, map, chat, claim checks, verification tiers, handover codes, and status changes are frontend demonstrations. They do not connect to a database, live map provider, SMS/email verification, or real users. Do not put secrets or private data in a publicly deployed repository.
