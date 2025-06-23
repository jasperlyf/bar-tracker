# 📦 Bar Tracker – Backend API (MVP Version)

This is the backend server for the Bar Tracker MVP. It provides APIs for storing and retrieving bar visit logs using Express and MongoDB.

## Insert Data to Seed

curl -X POST http://localhost:3001/api/topbars/seed

---

## ✅ Features

- Log a bar visit with:
  - Bar name
  - Location
  - Date
  - Cost
  - Ratings: Vibe, Service, Drinks (1–5)
  - People you went with
  - Optional: Drinks you had
- Fetch all visits (to render chart, list, filter, etc.)

---

## 🛠️ Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Data format**: JSON

---

## 🔌 MongoDB Schema (barVisit.js)

```js
const mongoose = require("mongoose");

const barVisitSchema = new mongoose.Schema({
  bar: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  drink: { type: String }, // optional
  cost: { type: Number, required: true },
  people: [{ type: String }],
  rating: {
    vibe: { type: Number, min: 1, max: 5 },
    service: { type: Number, min: 1, max: 5 },
    drinks: { type: Number, min: 1, max: 5 },
  },
});

module.exports = mongoose.model("BarVisit", barVisitSchema);
```

---

## 🚀 API Endpoints

### POST `/api/barvisits`

Create a new bar visit log

**Body:**

```json
{
  "bar": "Atlas Bar",
  "location": "Singapore",
  "date": "2025-06-22",
  "drink": "Negroni",
  "cost": 25,
  "people": ["John", "Alice"],
  "rating": {
    "vibe": 4,
    "service": 5,
    "drinks": 5
  }
}
```

### GET `/api/barvisits`

Fetch all bar visit logs

---

## 🌱 Setup

1. Create `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bartracker
```

2. Install dependencies:

```bash
npm install express mongoose cors dotenv
```

3. Start server:

```bash
node index.js
```

---

## 📌 Notes

- No user accounts yet — this is a personal-only MVP
- Future version will support authentication and multi-user features
