const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function parseJoinDate(value) {
  if (!value) return null
  const [day, monthName, year] = value.split(' ')
  const month = monthNames.indexOf(monthName)
  if (month < 0) return null
  return new Date(Number(year), month, Number(day))
}

export function formatDateISO(date) {
  if (!date) return ''
  let d = date
  if (typeof date === 'string') {
    d = new Date(date)
    if (Number.isNaN(d.getTime())) {
      const parsed = parseJoinDate(date)
      d = parsed || new Date(date)
    }
  }
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return ''
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function formatDateDisplay(value) {
  if (!value) return ''
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return value
  const day = String(date.getDate()).padStart(2, '0')
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export function addDays(value, days) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return null
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}
