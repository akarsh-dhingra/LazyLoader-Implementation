# Student Search SPA (React + Node.js)

A full-stack **Single Page Application (SPA)** that allows users to search for students using a **lazy-loaded search bar**. The application implements **debounced searching, client-side caching, request cancellation, and backend query caching** to ensure efficient performance even with larger datasets.

The frontend is built with **React (Vite)** and the backend is a **Node.js Express REST API** that reads student data from a local JSON file.

---

# Features

## Frontend (React)

* Lazy-loaded search that only triggers when the query has **3 or more characters**
* **Debounced search (300ms delay)** to avoid excessive API calls
* **Client-side caching** for previously searched queries
* **Request cancellation** using `AbortController`
* **Race condition protection** to ensure only the latest request updates the UI
* **Dynamic dropdown suggestions (max 5 results)**
* **Highlighting of matched prefix in search results**
* Responsive and clean UI using Tailwind CSS

## Backend (Node.js + Express)

* RESTful API endpoint for student search
* Loads student dataset from a **local JSON file**
* **Prefix-based case-insensitive search**
* **Precomputed lowercase names** for faster matching
* **In-memory query cache with LRU-style eviction**
* **Input validation and query trimming**
* Returns **maximum 5 matching students**

---

# Project Architecture

```
Frontend (React SPA)
        |
        | HTTP API request
        |
Backend (Node.js + Express)
        |
        | Load dataset
        |
students.json
```

Search Flow:

```
User types query
      ↓
Debounced input (300ms)
      ↓
Check client-side cache
      ↓
API request (if needed)
      ↓
Backend cache lookup
      ↓
Prefix search on dataset
      ↓
Return top 5 results
```

---

# Key Frontend Patterns Used

## Debouncing

Reduces API calls by waiting **300ms after typing stops** before sending the request.

## Lazy Loading

Search only triggers when the query length is **≥ 3 characters**.

## Request Cancellation

Previous API requests are cancelled when a new query starts using **AbortController**.

## Race Condition Protection

Each request gets an ID so **only the latest request updates the UI**.

## Client-side Caching

Repeated queries return results instantly without calling the API.

## Controlled Input

React state fully controls the search input field.

---

# Backend Optimizations

## Preloading Dataset

Student data is loaded **once at server startup** to avoid repeated disk reads.

## Precomputed Search Fields

Each student has a precomputed `nameLower` field for faster case-insensitive matching.

## Prefix-based Search

Uses `startsWith()` instead of substring matching for improved performance.

## Query Caching

An in-memory `Map` stores previous query results.

Cache structure:

```
queryLower → [top5Results]
```

The cache automatically removes the **oldest entries when the limit is exceeded**.

---

# API Endpoint

### Search Students

```
GET /api/studentsearch?q=<query>
```

Example:

```
/api/studentsearch?q=jas
```

Response:

```json
[
  {
    "name": "Jaspreet Singh",
    "class": "10A",
    "rollNumber": 12
  }
]
```

Rules:

* Query must contain **at least 3 characters**
* Search is **case-insensitive**
* Maximum **5 results returned**

---

# Setup Instructions

## 1. Clone the Repository

```
git clone https://github.com/akarsh-dhingra/LazyLoader-Implementation
cd LazyLoader-Implementation
```

---

# Backend Setup

### Navigate to backend folder

```
cd backend
```

### Install dependencies

```
npm install
```

### Start backend server

```
node index.js
```

Server runs on:

```
http://localhost:8080
```

---

# Frontend Setup

### Navigate to frontend project

```
cd frontend/vite-project
```

### Install dependencies

```
npm install
```

### Start development server

```
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Environment Configuration

If deploying locally, ensure the frontend uses the correct backend API URL.

Example API call in the frontend:

```
http://localhost:8080/api/studentsearch?q=<query>
```

For deployment, replace with the deployed backend URL.

---

# Edge Cases Handled

The system correctly handles:

* Similar name prefixes

  * Example: `Amritpal Singh` vs `Amrita Sharma`
* Case-insensitive search

  * `jas` matches `Jaspreet`
* Students with identical names but different roll numbers
* Queries containing spaces or special characters
* Rapid typing and network race conditions

---

# Performance Considerations

The system includes multiple optimizations:

| Optimization                | Benefit                   |
| --------------------------- | ------------------------- |
| Debounced search            | Fewer API requests        |
| Lazy loading                | Avoid unnecessary queries |
| Client cache                | Instant repeat search     |
| Backend cache               | Faster repeated queries   |
| Precomputed lowercase names | Reduced computation       |
| Prefix search               | Faster filtering          |

---

# Technologies Used

Frontend

* React
* Vite
* Axios
* Tailwind CSS

Backend

* Node.js
* Express.js
* Native Node File System (`fs`)

---

# Future Improvements

Possible enhancements include:

* Pagination for large datasets
* Server-side indexing for faster search
* Redis for distributed caching
* Keyboard navigation for dropdown results
* Fuzzy search support

---

# Author

Akarsh Dhingra
