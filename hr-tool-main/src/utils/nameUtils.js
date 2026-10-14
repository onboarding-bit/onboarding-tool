export function getEmployeeDisplayName(employee = {}) {
  if (!employee) return ''
  const { firstName, lastName, name } = employee
  if (firstName || lastName) return `${(firstName || '').trim()} ${(lastName || '').trim()}`.trim()
  if (name) return name
  return ''
}

export function splitFullName(fullName = '') {
  if (!fullName) return { firstName: '', lastName: '' }
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  const firstName = parts.slice(0, parts.length - 1).join(' ')
  const lastName = parts[parts.length - 1]
  return { firstName, lastName }
}
