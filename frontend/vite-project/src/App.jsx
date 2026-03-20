import { useState } from "react";
import SearchBar from "./components/searchbar";
import StudentDetails from "./components/studetails";

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-slateSoft text-slate-900">
      <div className="relative overflow-hidden">
        {/* Subtle background blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-slateSoft/70 blur-3xl" />
          <div className="absolute top-32 -right-28 h-56 w-56 rounded-full bg-cream/80 blur-3xl" />
        </div>

        <header className="relative mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                Student Search
              </h1>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-600 md:text-lg">
                Type at least 3 letters to search by student name. Results are
                prefix-only, case-insensitive, and capped to the top 5 matches.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
                  Prefix match
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
                  Case-insensitive
                </span>
                <span className="rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-sm text-slate-700">
                  Up to 5 results
                </span>
              </div>
            </div>

            {/* White hero card */}
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-2xl backdrop-blur md:p-8">
              <SearchBar onSelect={setSelectedStudent} />
              <div className="mt-6">
                <StudentDetails student={selectedStudent} />
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default App;