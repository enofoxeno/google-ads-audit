# Decisions and assumptions

## Design
- Look derived from the Framer reference: forest-black and cream/sand sections, antique gold, Lora (serif) with Figtree (sans), near-square corners, hairline bordered grids. All code, icons and copy are original. No template assets.
- Gold on cream fails AA, so small gold text on light sections uses a darker gold (#7a6021) and gold buttons use dark text.
- No navigation links (landing page). Header has the wordmark and one CTA.
- Motion: one staggered hero entrance, a blurred sticky header after scrolling, button hover states. Everything is disabled under reduced motion. No scroll reveals, no marquee.
- Template sections dropped: stats row, testimonial carousel, stock photo band, image marquee, gold seal. They only carried template content.

## Content
- Copy kept close to the existing page (message match with the ads): headline, subhead, "no sales call, read-only access".
- Six review areas are based on the original three (tracking, search terms, structure and spend) plus lead quality data, bidding and the fix list.
- "How the audit works" uses numerals because it is a real sequence. "Who this is for" does not.
- Added a short FAQ for the access, call, cost and fit objections.

## Assets
- Hero portrait is your photo (desktop, background). On mobile the same photo appears in the About section.
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
- Proof: no verified results or testimonials are published. Add a proof section when you have permissioned quotes or numbers.
- Bio: confirm the About wording and add one verifiable credential.
- FAQ answer "Is the audit really free?" is a positioning choice. Confirm it.
- No contact email is shown. Add one to the footer if you want it.
