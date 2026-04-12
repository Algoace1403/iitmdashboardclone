import type { Student, Course, GradeSummary, Notice } from "./types";

import studentData from "@/data/student.json";
import coursesData from "@/data/courses.json";
import gradesData from "@/data/grades.json";
import noticesData from "@/data/notices.json";

export function getStudent(): Student {
  return studentData as unknown as Student;
}

export function getCourses(): Course[] {
  return coursesData as unknown as Course[];
}

export function getCourseById(id: string): Course | undefined {
  return getCourses().find((c) => c.id === id);
}

export function getGrades(): GradeSummary[] {
  return (gradesData as { terms: GradeSummary[] }).terms;
}

export function getNotices(): Notice[] {
  return noticesData as Notice[];
}
