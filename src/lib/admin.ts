export function getAdminEmails(): string[] {
  return ['gayatri@gayatrilawoffices.in', 'rahulguptax14@gmail.com', 'advocategayatrigupta@gmail.com', 'gayatrigupta.law@gmail.com']
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = getAdminEmails()
  if (allowed.length === 0) return false
  return allowed.includes(email.trim().toLowerCase())
}
