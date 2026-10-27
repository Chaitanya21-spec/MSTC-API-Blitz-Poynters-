# LitCanvas

A literary discovery site built with React, Vite, and Tailwind CSS. The interface brings books, art, poetry, and vocabulary together in a calm editorial design.

## Run locally

1. Install Node.js (LTS): https://nodejs.org/
2. Extract this project and open a terminal in the `litcanvas` folder.
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open the local URL printed by Vite (normally http://localhost:5173).
6. Check the production bundle with `npm run build`.

## Data sources

- **Open Library** powers the main book search and book metadata: https://openlibrary.org/developers/api
- **Gutendex** powers the public-domain book explorer: https://gutendex.com/
- **Art Institute of Chicago API** powers the artwork search: https://api.artic.edu/docs/
- **Free Dictionary API** powers word definitions: https://dictionaryapi.dev/
- **PoetryDB** powers the poetry corner: https://github.com/thundercomb/poetrydb

These integrations use public endpoints and do not require API keys for the current client-side features. They do depend on the services being online and may be subject to rate limits or browser/network restrictions. Each collection displays a helpful error state when a request fails.

## Features

- Responsive editorial-style home page
- Open Library search and book details
- Save/remove books from a local reading list (`localStorage`)
- Light/dark theme preference (`localStorage`)
- Dictionary word lookup
- Gutendex public-domain book explorer
- Art Institute of Chicago public-domain artwork explorer
- PoetryDB random poems and title search

## Notes

- The reading list is stored only in the current browser; there is no account or server sync.
- PoetryDB content and API availability are external dependencies. The poetry endpoint may return errors for some searches.
- For public deployment, review each API's current terms, attribution requirements, and rate limits.
