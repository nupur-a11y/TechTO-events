# TechTO event checklist

A shared event-ops checklist. Pick an event, tick items off (with who and when), leave notes for teammates, and edit the checklist inline. Events of the same type share one checklist.

Everything is a static site: `index.html` plus a small Firebase layer (`firebase-adapter.js`) that provides sign-in and saves the data. No build step.

## Files
- `index.html`: the app
- `firebase-adapter.js`: Google sign-in and Firestore storage
- `firebase-config.js`: your Firebase project's web config (you paste this)
- `firestore.rules`: who can read and write (you paste this into Firebase)
- `seed.json`: the starter checklist (53 items), imported with one button on first use

## One-time setup
1. **Create a Firebase project** at https://console.firebase.google.com (the free Spark plan is enough).
2. **Add a web app** (Project settings > Your apps > `</>`). Copy the config into `firebase-config.js`.
3. **Turn on sign-in:** Build > Authentication > Sign-in method > Google > Enable.
4. **Authorize the site:** Authentication > Settings > Authorized domains > add `nupur-a11y.github.io`.
5. **Create the database:** Build > Firestore Database > Create database (production mode).
6. **Set who has access:** open `firestore.rules`, replace the example emails with your team's Google emails, then paste the file into Firestore > Rules and Publish. Anyone not on that list is blocked, even if they find the link.
7. **Turn on GitHub Pages:** repo Settings > Pages > Deploy from a branch > `main` / root. The site will be at https://nupur-a11y.github.io/techto-events/
8. Open the site, sign in, press **Import starter checklist**, then **New event**.

To add a teammate later, add their email to the rules and publish again.
