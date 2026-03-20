import { useEffect, useRef, useState } from "react";
import axios from "axios";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

function SearchBar({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const cacheRef = useRef(new Map()); // queryLower -> results
  const latestRequestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    const normalizedQuery = debouncedQuery.trim();

    // Lazy loading: do not hit the API until >= 3 chars.
    if (normalizedQuery.length < 3) {
      abortControllerRef.current?.abort();
      // Avoid synchronous state updates inside the effect body.
      const delay = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(delay);
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++latestRequestIdRef.current;
    const qLower = normalizedQuery.toLowerCase();

    const cached = cacheRef.current.get(qLower);
    if (cached) {
      // Avoid synchronous state updates inside the effect body.
      setTimeout(() => {
        if (requestId === latestRequestIdRef.current) setResults(cached);
      }, 0);
      return () => controller.abort();
    }

    axios
      .get(
        `https://lazyloader-implementation.onrender.com/api/studentsearch?q=${encodeURIComponent(normalizedQuery)}`,
        { signal: controller.signal }
      )
      .then((res) => {
        // "Latest request wins": ignore stale responses.
        if (requestId !== latestRequestIdRef.current) return;
        cacheRef.current.set(qLower, res.data);
        setResults(res.data);
      })
      .catch((err) => {
        // Ignore expected cancellations.
        if (
          err?.code === "ERR_CANCELED" ||
          err?.name === "CanceledError" ||
          err?.message?.toLowerCase().includes("canceled")
        ) {
          return;
        }

        console.error(err);

        if (requestId === latestRequestIdRef.current) setResults([]);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <div className="w-full">
        <input
          type="text"
          placeholder="Search student..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-3 w-full max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          {(() => {
            const prefix = debouncedQuery.trim();
            const prefixLower = prefix.toLowerCase();
            const prefixLen = prefix.length;

            return results.map((student) => {
              const name = String(student.name ?? "");
              const nameLower = name.toLowerCase();

              const shouldHighlight =
                prefixLen > 0 && nameLower.startsWith(prefixLower);

              return (
                <li
                  key={student.rollNumber}
                  onClick={() => onSelect(student)}
                  className="cursor-pointer px-4 py-2 text-slate-900 hover:bg-slateSoft/60"
                >
                  {shouldHighlight ? (
                    <>
                      <mark className="rounded bg-cream px-1 font-medium text-slate-900">
                        {name.slice(0, prefixLen)}
                      </mark>
                      {name.slice(prefixLen)}
                    </>
                  ) : (
                    name
                  )}
                </li>
              );
            });
          })()}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
