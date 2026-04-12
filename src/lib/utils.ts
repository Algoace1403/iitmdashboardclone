export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    S: "text-green-600 bg-green-50",
    A: "text-blue-600 bg-blue-50",
    B: "text-indigo-600 bg-indigo-50",
    C: "text-yellow-600 bg-yellow-50",
    D: "text-orange-600 bg-orange-50",
    E: "text-red-500 bg-red-50",
    U: "text-red-700 bg-red-100",
    W: "text-gray-500 bg-gray-100",
    I: "text-gray-400 bg-gray-50",
  };
  return colors[grade] || "text-gray-600 bg-gray-50";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ongoing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    upcoming: "bg-gray-100 text-gray-600",
    submitted: "bg-green-100 text-green-700",
    graded: "bg-purple-100 text-purple-700",
    missed: "bg-red-100 text-red-700",
    not_started: "bg-gray-100 text-gray-600",
    in_progress: "bg-yellow-100 text-yellow-700",
    open: "bg-blue-100 text-blue-700",
    locked: "bg-gray-200 text-gray-500",
  };
  return colors[status] || "bg-gray-100 text-gray-600";
}
