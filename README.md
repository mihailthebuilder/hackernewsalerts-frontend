# hackernewsalerts-frontend

The frontend for [hackernewsalerts.com](https://hackernewsalerts.com). A web application that...

- sends email notifications when someone replies to one of your comments or posts on Hacker News
- allows you to check in the UI for such events

[Link to the backend](https://github.com/mihailthebuilder/hackernewsalerts-backend).

## Architecture

Built with [Astro](https://astro.build/). I use React [islands](https://docs.astro.build/en/concepts/islands/) for the interactive components, and [Nano Stores](https://docs.astro.build/en/recipes/sharing-state-islands/) to share state between the islands.

The backend API handles email signups. For viewing replies/comments in the UI, the website calls
[hnrss.github.io](https://hnrss.github.io/) via a reverse proxy that you have to set up.

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
