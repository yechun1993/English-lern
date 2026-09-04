export function collectContentIssues(questionIssues: string[], passageIssues: string[]): string[] {
  return [...questionIssues, ...passageIssues]
}
