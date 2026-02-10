# Music Discovery Platform (Mobile + Backend)

## Overview

This project is a **full-stack music discovery platform** consisting of:

* **Mobile Frontend** (React Native / Expo)
* **Backend API** (Node.js + Express)
* **External Music Data** (Last.fm API)

The goal is to support **music trend discovery**, allowing users to explore:

* Top tracks by artist
* Music by genre (tags)
* Trending/global charts

The architecture is modular and designed to scale to additional providers (Spotify, Apple Music) in the future.

---

## Tech Stack

### Frontend (Mobile)

* **React Native**
* **Expo**
* **Expo Router (Tabs)** – File-based routing with bottom tabs
* **TypeScript**
* **Axios / Fetch** – API calls
* **React Native Gesture Handler**

---

## High-Level Architecture

```
[ Mobile App (Expo) ]
          │
          │ HTTP (REST)
          ▼
[ Backend API (Express) ]
          │
          │ Axios
          ▼
[ Last.fm API ]
```

---

## Project Structure

```
project-root/
│
├── backend/
│   ├── src/
│   │   ├── app.js                # Express app configuration
│   │   ├── server.js             # Server entry point
│   │   │
│   │   ├── routes/
│   │   │   └── lastfm.routes.js  # API routes
│   │   │
│   │   ├── services/
│   │   │   └── lastfm.service.js # Last.fm API logic
│   │   │
│   │   └── config/
│   │       └── lastfm.js         # Base config (optional)
│   │
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── mobile/
│   ├── app/                      # Expo Router root (desired layout)
│   │   ├── (tabs)/               # Bottom tab navigator
│   │   │   ├── index.tsx         # Discover tab
│   │   │   ├── genres.tsx        # Genres tab
│   │   │   └── artists.tsx       # Artists tab
│   │   │
│   │   ├── artist/[name].tsx     # Artist details screen
│   │   ├── genre/[tag].tsx       # Genre results screen
│   │   └── _layout.tsx           # Root layout
│   │
│   ├── components/               # Reusable UI components
│   ├── services/                 # API client layer
│   ├── app.json
│   └── package.json
│
└── README.md
└── .gitignore

```

---

## Environment Variables

### Backend `.env`


```
LASTFM_API_KEY=your_lastfm_api_key
PORT=3000
```

⚠️ Restart the backend server after changes.

---

## Backend API

All routes are prefixed with:

```
/api/lastfm
```

### Get Top Tracks by Artist

```
GET /api/lastfm/artist/:artist/tracks
```

Query params:

* `page` (default: 1)
* `limit` (default: 10)

Example:

```
curl "http://localhost:3000/api/lastfm/artist/Coldplay/tracks?page=1&limit=5"
```

---

### Get Top Tracks by Genre (Tag)

```
GET /api/lastfm/tag/:tag/tracks
```

Example:

```
curl "http://localhost:3000/api/lastfm/tag/pop/tracks"
```

---

### Get Global Top Tracks

```
GET /api/lastfm/chart/tracks
```

---

## Pagination

All list endpoints support pagination using:

* `page`
* `limit`

Standard response format:

```
{
  page,
  perPage,
  totalPages,
  total,
  data: []
}
```

---

## Frontend (Mobile App)

### API Service Layer Example

```ts
const API_BASE_URL = 'http://localhost:3000/api/lastfm';

export const getTopTracksByArtist = async (artist: string) => {
  const res = await fetch(`${API_BASE_URL}/artist/${artist}/tracks`);
  return res.json();
};
```

---

### Example Screen Flow

* **Discover Screen**

  * Global top tracks
* **Genre Screen**

  * Select genre → fetch tracks
* **Artist Screen**

  * Artist details + top tracks

---

## Local Development

### Backend

```
cd backend
npm install
npm run dev
```

### Mobile

```
cd mobile
npm install
npx expo start
```

---

## Common Issues

### `Cannot find module lastfmRouter`

✔ Ensure the route file exists and paths are correct:

```
require('./routes/lastfm.routes')
```

---

### `Invalid parameters - missing required parameter`

✔ Last.fm requires:

* `method`
* `api_key`
* `format=json`

Ensure these are set in the service layer.

---

### `process.env not loading`

✔ Fix:

* Call `dotenv.config()` at the very top of `server.js`
* Ensure `.env` is in `backend/`

---

---

## Developer Notes

This project follows a **clean separation of concerns**:

* Mobile app handles UI + UX
* Backend handles data aggregation & validation
* External APIs are abstracted behind services

This makes it easy to:

* Swap music providers
* Add authentication
* Scale into microservices

---
