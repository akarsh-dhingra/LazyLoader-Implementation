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
//  Load all the data that we've at the start so that 
// you don't  have to make API calls every time you've to fetch now virtually you've an 
// array of objects.


// fs.readFileSync-> It does the following -> read: read the file , file:file operation, Sync:synchronous
// It opened the file when the backend started read the entire content and converted it into UTF8 format and then it 
// returned the text.

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
    if (typeof q !== "string") return res.json([]);

    const query = q.trim();
    if (query.length < 3) return res.json([]);

    const queryLower = query.toLowerCase();

    const cached = getCachedResults(queryLower);
    if (cached) return res.json(cached);

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

