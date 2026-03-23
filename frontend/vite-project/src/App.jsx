import { useState } from "react";
import SearchBar from "./components/searchbar";
import StudentDetails from "./components/studetails";

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 blur-3xl" />
          <div className="absolute top-40 -right-32 h-72 w-72 rounded-full bg-gradient-to-bl from-pink-200/40 to-orange-200/40 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-gradient-to-t from-blue-100/30 to-transparent blur-3xl" />
        </div>

        <header className="relative mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <h1 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
              Student Search
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600 md:text-xl">
              Type at least 3 letters to search by student name. Results are
              prefix-only, case-insensitive, and capped to the top 5 matches.
            </p>

            {/* Feature badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="rounded-full border border-indigo-200 bg-white/80 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm backdrop-blur">
                ✦ Prefix match
              </span>
              <span className="rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm backdrop-blur">
                ✦ Case-insensitive
              </span>
              <span className="rounded-full border border-pink-200 bg-white/80 px-4 py-2 text-sm font-medium text-pink-700 shadow-sm backdrop-blur">
                ✦ Top 5 results
              </span>
            </div>
          </div>

          {/* Main card */}
          <div className="mt-12 rounded-3xl border border-white/60 bg-white/70 p-1 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
              <SearchBar onSelect={setSelectedStudent} />
              <div className="mt-8">
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