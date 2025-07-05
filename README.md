# Bar Tracker

Bar Tracker is a personal app designed to log, rate, and explore bars across Asia and beyond. Whether you're checking off the Top 100 Bars list or tracking your own experiences, this app helps organize your journey with ease.

---

## MVP Features (June 2025)

### 1. Home Page

- Displays top-rated bars based on personal rating data (average of vibe, service, drinks).
- Shows most visited bars based on frequency of visits.
- Allows filtering by country to narrow down the top-rated view.
- Dynamic bar images using Unsplash for visual presentation.

---

### 2. My Visits Page

- Add new bar visit with the following fields:
  - Bar name (with autocomplete from Top 100 list)
  - Address (auto-filled if matched)
  - Country (auto-filled if matched)
  - Date of visit
  - Rating (vibe, service, drinks — 1–5)
- View all visit logs in a clean sortable/filterable table.
- Support full CRUD operations (edit, delete).
- Filter by country for now (more filters like date, rating will come after MVP).
- Rating input with dropdowns for usability.
- Future: Include visual analytics (charts, trends) to understand visit behavior and preferences.

---

### 3. My List Page

- Dedicated page for bookmarked bars the user wants to visit.
- Users can bookmark bars directly from the Top 100 Bars page.
- Each bookmarked bar is saved to the list.
- Future: Allow manual additions and more organization (e.g., categories, notes).

---

### 4. Top 100 Bars Page

- Displays curated list of the Top 100 Bars in Asia.
- Shows whether the user has visited each bar.
- Includes:
  - Visit count
  - Last visited date
  - Average rating summary
- Each bar has a "bookmark" button to add it to the "My List" page.

---

## Features Planned After MVP

### UI + UX Enhancements

- Rating via stars, emojis, or sliders
- Better layout for adding/editing forms
- Mobile responsiveness and dark mode

### Filters + Autocomplete

- Smart autocomplete for bars outside of Top 100
- Filters by rating, date, city, bar name

### Analytics + Insights

- Charts showing:
  - Ratings by city/country
  - Frequency of visits
  - Personal trends over time

### User System

- Authentication with JWT
- Public/private profiles
- Cross-device sync

### Community & Social

- Public bar reviews
- Shared lists
- Leaderboard (most bars visited)

---

## Tech Stack

| Area     | Tech                                        |
| -------- | ------------------------------------------- |
| Frontend | React, Tailwind CSS                         |
| Backend  | Node.js, Express                            |
| Database | MongoDB Atlas                               |
| Hosting  | Render (backend), Vercel (frontend planned) |
| Tools    | Axios, React Router DOM                     |

---

## Getting Started

```bash
# Clone this repo
git clone https://github.com/your-username/bar-tracker.git

# Install dependencies
cd server && npm install
cd ../client && npm install

# Run backend
cd ../server && npm run dev

# Run frontend
cd ../client && npm run dev
```

---
