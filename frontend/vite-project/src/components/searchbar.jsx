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
      {/* Search input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search student..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-slate-900 shadow-sm placeholder:text-slate-400 transition-all duration-200 focus:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-100"
        />
        {query.length >= 3 && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm">
              {results.length} found
            </span>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {results.length > 0 && (
        <ul className="mt-4 w-full max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
          {(() => {
            const prefix = debouncedQuery.trim();
            const prefixLower = prefix.toLowerCase();
            const prefixLen = prefix.length;

            return results.map((student, index) => {
              const name = String(student.name ?? "");
              const nameLower = name.toLowerCase();

              const shouldHighlight =
                prefixLen > 0 && nameLower.startsWith(prefixLower);

              return (
                <li
                  key={student.rollNumber}
                  onClick={() => onSelect(student)}
                  className="group cursor-pointer border-b border-slate-100 px-5 py-3.5 transition-all duration-150 last:border-0 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar circle */}
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-sm font-bold text-white shadow-sm transition-transform duration-150 group-hover:scale-110">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-900">
                        {shouldHighlight ? (
                          <>
                            <span className="rounded bg-gradient-to-r from-indigo-100 to-purple-100 px-1.5 font-semibold text-slate-900">
                              {name.slice(0, prefixLen)}
                            </span>
                            {name.slice(prefixLen)}
                          </>
                        ) : (
                          name
                        )}
                      </span>
                    </div>
                    {/* Chevron */}
                    <svg className="h-4 w-4 text-slate-300 transition-all duration-150 group-hover:translate-x-1 group-hover:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              );
            });
          })()}
        </ul>
      )}

      {/* No results message */}
      {query.length >= 3 && results.length === 0 && (
        <div className="mt-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">No students found matching "{query}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
