export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatProgress(progress: number): string {
  return `${Math.round(progress)}%`
}

export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return (completed / total) * 100
}
