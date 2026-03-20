import express from "express";
import cors from "cors";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT=process.env.PORT||8080;
app.use(cors());

const studentsPath = path.join(__dirname, "data", "students.json");

// Preload students once at startup to avoid blocking I/O on every request.
const rawStudents = JSON.parse(fs.readFileSync(studentsPath, "utf8"));
// Precompute `nameLower` for faster prefix matching.
const students = rawStudents.map((s) => ({
    ...s,
    nameLower: String(s.name ?? "").toLowerCase(),
}));

// Simple in-memory cache: queryLower -> cached top5 results.
// Keeps repeated searches fast as the dataset grows.
const queryCache = new Map();
const MAX_CACHE_ENTRIES = 500;

function getCachedResults(queryLower) {
    if (!queryCache.has(queryLower)) return null;
    // Refresh insertion order (lightweight LRU).
    const value = queryCache.get(queryLower);
    queryCache.delete(queryLower);
    queryCache.set(queryLower, value);
    return value;
}

function setCachedResults(queryLower, results) {
    queryCache.set(queryLower, results);
    if (queryCache.size <= MAX_CACHE_ENTRIES) return;
    const oldestKey = queryCache.keys().next().value;
    if (oldestKey !== undefined) queryCache.delete(oldestKey);
}

app.get("/api/studentsearch", (req, res) => {
    const q = req.query.q;

    // Robustness: only accept string query params.
    if (typeof q !== "string") return res.json([]);

    const query = q.trim();
    if (query.length < 3) return res.json([]);

    const queryLower = query.toLowerCase();

    const cached = getCachedResults(queryLower);
    if (cached) return res.json(cached);

    // Prefix-only, case-insensitive match.
    const results = students
        .filter((s) => s.nameLower.startsWith(queryLower))
        .slice(0, 5)
        .map(({ nameLower, ...student }) => student);

    setCachedResults(queryLower, results);
    return res.json(results);
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});


