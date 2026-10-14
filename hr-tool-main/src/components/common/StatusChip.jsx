import { Chip } from '@mui/material'

export const statusConfig = {
  'In Progress': { backgroundColor: '#E8F0FE', color: '#1A73E8' },
  Ready: { backgroundColor: '#E6F4EA', color: '#188038' },
  // Pending: light gray background with gray text
  Pending: { backgroundColor: '#F1F1F1', color: '#9E9E9E' },
  Overdue: { backgroundColor: '#FCE8E6', color: '#D93025' },
  Completed: { backgroundColor: '#E6F4EA', color: '#188038' },
  // Scheduled: darker mustard text with very light warm yellow background
  Scheduled: { backgroundColor: '#FFF8E1', color: '#B7791F' },
  Active: { backgroundColor: '#E8F0FE', color: '#1A73E8' },
  'On Track': { backgroundColor: '#E8F0FE', color: '#1A73E8' },
  'Pending Documents': { backgroundColor: '#FFF4E5', color: '#B06000' },
  Preboarding: { backgroundColor: '#E8F0FE', color: '#1A73E8' },
  Onboarding: { backgroundColor: '#E6F4EA', color: '#188038' },
}

function StatusChip({ label, size = 'small', sx = {} }) {
  const config = statusConfig[label] ?? { backgroundColor: '#F5F5F5', color: '#9E9E9E' }

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        backgroundColor: config.backgroundColor,
        color: config.color,
        fontWeight: 600,
        borderRadius: 1,
        ...sx,
      }}
    />
  )
}

export default StatusChip
