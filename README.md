# TechTO event checklist

A shared event-ops checklist. Pick an event, tick items off (with who and when), leave notes for teammates, and edit the checklist inline. Events of the same type share one checklist.

**Live demo:** https://nupur-a11y.github.io/techto-events/

The demo runs entirely in your browser with sample data. Nothing is saved: reloading the page resets it, and nobody else sees your changes.

## Files
- `index.html`: the whole app (one file, no build step)
- `demo-adapter.js`: in-memory data with a starter checklist and two sample events
- `seed.json`: the starter checklist (53 items)
- `firebase/`: the version that saves data for real (Google sign-in plus Firestore). See below.

## Saving data for the team (later)
In `index.html`, replace
`<script src="demo-adapter.js"></script>` with
`<script type="module" src="firebase/firebase-adapter.js"></script>` and add
`<script>window.TECHTO_SEED_URL='seed.json';</script>` above it.
Then follow these steps:

1. Create a free Firebase project and add a web app. Paste its config into `firebase/firebase-config.js`.
2. Turn on Google sign-in. Add `nupur-a11y.github.io` as an authorized domain.
3. Create a Firestore database. Paste `firebase/firestore.rules` into Rules, with your team's emails in the list, and publish.
4. Open the site, sign in, press "Import starter checklist", then create your first event.
