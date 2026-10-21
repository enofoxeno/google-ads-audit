# Decisions and assumptions

## Design
- Look derived from the Framer reference: forest-black and cream/sand sections, antique gold, Lora (serif) with Figtree (sans), near-square corners, hairline bordered grids. All code, icons and copy are original. No template assets.
- Gold on cream fails AA, so small gold text on light sections uses a darker gold (#7a6021) and gold buttons use dark text.
- No navigation links (landing page). Header has the wordmark and one CTA.
- Motion: one staggered hero entrance, a blurred sticky header after scrolling, button hover states. Everything is disabled under reduced motion. No scroll reveals, no marquee.
- Template sections dropped: stats row, testimonial carousel, stock photo band, image marquee, gold seal. They only carried template content.

## Content
- One review sits above the fold under the portrait, with "Top Rated on Upwork". A dark "Top Rated on Upwork" section with the Upwork badge and four reviews follows "What the review covers". The badge has white lettering, so it only works on a dark background.
- One review sits above the fold under the portrait, with "Top Rated on Upwork". A dark "Top Rated on Upwork" section with the Upwork badge and four reviews follows "What the review covers". The badge has white lettering, so it only works on a dark background. No names are shown because the pasted reviews had none. Review schema is deliberately not added (self-served reviews are not eligible for rich results).
- Copy kept close to the existing page (message match with the ads): headline, subhead, "no sales call, read-only access".
- Six review areas are based on the original three (tracking, search terms, structure and spend) plus lead quality data, bidding and the fix list.
- "How the audit works" uses numerals because it is a real sequence. "Who this is for" does not.
- Added a short FAQ for the access, call, cost and fit objections.

## Assets
- Hero portrait is your photo as a single image: a large round portrait with a gold ring on the right of the hero on desktop (1100px and up), and a smaller round portrait beside the eyebrow line above the headline on mobile and tablet.
- Video thumbnail is used only when `videoId` is set in `assets/js/main.js`. Until then the video block stays hidden.

## Technical
- Plain HTML, CSS and an ES module. Fonts self-hosted (latin subset, woff2). Images are WebP.
- HubSpot embed loads from `main.js` using `CONFIG`. Two form instances (hero and closing CTA) share one form ID.
- Click ID and UTM capture is unchanged in behavior: last touch, 90 days, localStorage plus cookie, dataLayer event `attribution_ready`, hidden fields filled on form ready. New dataLayer event `audit_form_submitted` fires on submit for the GTM conversion trigger.
- Deploy workflow added at `.github/workflows/pages.yml`. It needs Pages source set to "GitHub Actions" (see steps). `CNAME` and `.nojekyll` are in the repo root.

## TODO
- GTM container ID in `index.html` (two places: head script and noscript iframe).
- HubSpot region, portal ID and form ID in `assets/js/main.js`.
- In HubSpot, set the form button text to "Get my free Google Ads audit" and the email placeholder to "you@yourbusiness.com". Confirm hidden-field internal names match the keys in `main.js`.
- Video: set `videoId`. See notes on the thumbnail text in the hand-off message.
- Proof: reviews come from your public Upwork profile, verbatim, trimmed only where an ellipsis shows. The claim "every reviewed Google Ads project is rated 5.0 out of 5" is based on the jobs you pasted (9 of 11 completed jobs). Check the other two before keeping it.
- Bio: confirm the About wording and add one verifiable credential.
- FAQ answer "Is the audit really free?" is a positioning choice. Confirm it.
- No contact email is shown. Add one to the footer if you want it.
