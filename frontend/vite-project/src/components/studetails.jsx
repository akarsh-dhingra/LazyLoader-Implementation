const StudentDetails = ({ student }) => {
  if (!student) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
        Select a student to view details.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <h2 className="text-lg font-semibold text-slate-900">Student Details</h2>
      <dl className="mt-3 grid gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-slate-600">Name</dt>
          <dd className="text-sm font-medium text-slate-900">{student.name}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-slate-600">Class</dt>
          <dd className="text-sm font-medium text-slate-900">{student.class}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-sm text-slate-600">Roll Number</dt>
          <dd className="text-sm font-medium text-slate-900">
            {student.rollNumber}
          </dd>
        </div>
      </dl>
    </div>
  );
};
export default StudentDetails;