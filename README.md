# Option 8 prototype: merge duplicate listings

Clickable prototype of the Option 8 flow from `../option-8-handoff`.

```bash
npm install
npm run dev
```

Opens on http://localhost:5178/. URLs use a hash (`/#/properties`) so the site works on GitHub Pages.

## Presenting
- The prototype opens on a start screen (`/`): start from Set up and grow, start from Properties, or Start from beginning to clear every choice. The Hospitable logo in the sidebar always returns there.
- Press the backtick key (`` ` ``) to open the prototype panel: jump to any screen, switch to the single-conflict variant, or reset.
- `?reset=1` after any screen's hash URL (for example `/#/properties?reset=1`) clears the session and returns to the properties list.
- `?variant=single` shows the single-conflict variant (8k), `?variant=full` switches back.
- State lives in `sessionStorage`, so a reload keeps your place.

## Structure
- `src/data/listings.ts` mock Airbnb and Booking.com listings, variants
- `src/state/merge.ts` store, and the derivations that compute 8h from the host's choices
- `src/routes/` one file per screen; `FieldReview.tsx` drives 8d to 8g and 8k from a field list
- `src/components/` sidebar, option card, modal, icons
- `src/styles/` tokens and styles

## Small additions beyond the spec
- **Set up and grow** (`/setup`, sidebar) is a second entry point, shown right after the host connects both accounts. It confirms the connection and shows the same merge prompt. Leaving the flow early (No, Not now, Save and finish later) returns to whichever screen the host started from.
- **Start from our suggestion** link inside "Write a new combined version" fills in the suggested Direct Booking text.
- Description starts with nothing selected, like the other field steps (the spec had it default to Keep).
- The merged property on the list after publishing takes the title and cover the host chose (the direct booking values), or Booking.com's name when Booking.com leads.
- **Remind me later** shows a short toast. The prompt stays.
- On 8h, a channel with no changes shows "Stays as it is" and "No changes" instead of "Goes live right away".
- Photos: "Combine into one set" is replaced by **Pick photos for both**. It shows every photo from both listings to tick; both channels and the direct booking site show exactly the picked photos, in the order picked, with the first as cover. Next stays disabled, with a warning, until at least 5 are picked.
- The direct booking site uses the chosen photo set when one platform's set or picked photos are chosen, otherwise the combined set with Airbnb's cover.

## Publishing
Pushing to `main` on GitHub runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repository settings, Pages must use **GitHub Actions** as its source.
