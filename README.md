# TechTO event checklist

A shared event-ops checklist for TechTO. Pick an event, tick items off, add notes for teammates, and edit the checklist inline. Events of the same type share one checklist.

- `index.html` is the whole app (single file, no build step).
- It stores its data (events, event types, checklist items, ticks, notes) with the Claude artifact database (`claude.use("db")`), so it only works when published as a Claude artifact. Opened as a plain file, it shows a "Saved data isn't available here" message.
- Live version: https://claude.ai/artifact/Fm1XYVqXqrpBdbX5XLfStM (owner access; teammates need Contributor access to tick items and add notes).
