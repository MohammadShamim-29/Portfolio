# BANGLADESH 24

A living, procedurally animated portrait of Bangladesh with Shamim's portfolio inside it. The landscape follows the real date and time in Asia/Dhaka, moves through six riverside zones as you scroll, and can preview seasons, national days and cultural events.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Production checks:

```bash
npm test
npm run build
npm run preview
```

## What is live, and what is a placeholder

The landscape, clocks, sun and moon positions, seasons, weather and event dates are generated from the data and engines in `src/`. Personal portfolio content lives in `src/data/portfolio.json`.

To update the portfolio:

- Edit `owner`, `hero`, `about`, `skills`, `projects`, `education`, `certifications`, `experience` and `contact` in `src/data/portfolio.json`.
- Contact links activate automatically when they are valid email addresses or HTTP(S) URLs. Placeholder values never become links.
- The downloadable CV is served from `public/cv/Shamim_CV.pdf`. Replace that file and keep `contact.cv.url` pointed at `/cv/Shamim_CV.pdf`.
- Project links marked with `TODO` are intentionally hidden until a real URL is added.

Do not invent credentials, employers, project results or contact details. Any unfinished value containing `TODO` is styled visibly rather than silently published.

## Dates and cultural content

Event data lives in `src/data/events.json`.

- Fixed national and cultural observances use `annual-fixed`.
- Lunar dates use explicit `dates` entries with `confirmed`, `estimated` or `manual-override` status and a source.
- Never change an `estimated` lunar date to `confirmed` without a published National Moon Sighting Committee announcement.
- The UI labels estimated dates. It does not present them as official.
- Bengali script is limited to decorative strings in `src/data/decorativeText.json`. The rest of the interface is English.

## Accessibility and performance

- `prefers-reduced-motion` pauses continuous animation, particles and pointer tilt. The landscape still follows scroll so every journey section remains visible. The Explorer can enable full motion for the current visit.
- The journey progress is anchored to section starts, so each section centers its matching landscape zone.
- The performance tier can be automatic, full, balanced or light. Light mode disables WebGL and most particles while keeping the portfolio usable.
- Ambient sound is muted by default. It only starts after an explicit Play action, and the synthesized mix changes with the journey zone, including calm village birds.
- The Explorer supports Escape to close, visible focus styles and a skip link.
- No audio is required to use the site.

## Project structure

```text
src/
  app/            application composition
  components/
    environment/  WebGL sky, SVG landscape, particles and decorations
    portfolio/    portfolio sections
    ui/           top bar, journey navigation, explorer and footer
  data/           themes, seasons, events, decorative text and portfolio content
  engines/        time, sun, season, weather, wind, event and theme logic
  hooks/          live clock, theme, performance, tilt, sound and scroll state
  styles/         global, environment, animation, portfolio, UI and responsive CSS
  utils/          dates, colours, random seeds, validation and scroll store
```

## Deployment

The included GitHub Actions workflow runs tests and builds the site for GitHub Pages. In the repository settings, set Pages to use **GitHub Actions** as the source.

`vite.config.js` infers the base path from `GITHUB_REPOSITORY`. For a custom domain or a user/organisation page, set `VITE_BASE_PATH` explicitly. For example:

```bash
VITE_BASE_PATH=/ npm run build
```

## Notes

- Timezone handling is pinned to `Asia/Dhaka`, not the visitor's local timezone.
- Weather is deterministic for a given Dhaka date and season; it is an atmospheric mood, not a forecast.
- Event visuals are respectful and avoid political or sectarian imagery.
