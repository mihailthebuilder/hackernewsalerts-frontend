# hackernewsalerts-frontend

The frontend for [hackernewsalerts.com](https://hackernewsalerts.com). A web application that sends email notifications when someone replies to one of your comments or posts on Hacker News.

[Link to the backend](https://github.com/mihailthebuilder/hackernewsalerts-backend).

## Architecture

Built using [Astro](https://astro.build/) with...

- React [islands](https://docs.astro.build/en/concepts/islands/)
- Nanostores
- reverse proxy

## TODO

- handle invalid characters in username

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |
