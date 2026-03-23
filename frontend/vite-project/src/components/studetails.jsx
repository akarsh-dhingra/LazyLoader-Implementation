const StudentDetails = ({ student }) => {
  if (!student) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <p className="text-slate-500">Select a student to view details</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-shadow duration-300 hover:shadow-xl">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.166 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Student Details</h2>
        </div>
      </div>

      {/* Student info */}
      <div className="p-6">
        {/* Student avatar */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 text-white shadow-md">
            <span className="text-lg font-bold">{student.name.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-sm text-slate-500">Student Name</p>
            <p className="text-lg font-bold text-slate-800">{student.name}</p>
          </div>
        </div>

        {/* Details grid */}
        <dl className="grid gap-4">
          <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v1a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Class</dt>
                <dd className="text-base font-semibold text-slate-800">{student.class}</dd>
              </div>
            </div>
          </div>

          <div className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-pink-300 hover:bg-pink-50/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100">
                <svg className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Roll Number</dt>
                <dd className="text-base font-semibold text-slate-800">{student.rollNumber}</dd>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};
export default StudentDetails;