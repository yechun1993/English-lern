export const EXAM_DATE = new Date(2026, 9, 17)

function atStartOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function daysUntilExam(now: Date, examDate = EXAM_DATE): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const difference = atStartOfLocalDay(examDate).getTime() - atStartOfLocalDay(now).getTime()

  return Math.max(0, Math.round(difference / millisecondsPerDay))
}
