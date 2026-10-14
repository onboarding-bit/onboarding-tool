import { ChevronRight, CheckCircle, RadioButtonUnchecked, Schedule, WarningAmber } from '@mui/icons-material'
import { Box, IconButton, Stack, Typography } from '@mui/material'
import { formatDateDisplay } from '../../utils/dateUtils'
import StatusChip, { statusConfig as centralizedStatusConfig } from '../common/StatusChip'

const statusIcons = {
  Completed: CheckCircle,
  'In Progress': WarningAmber,
  Scheduled: Schedule,
  Pending: RadioButtonUnchecked,
  Overdue: WarningAmber,
}

function ChecklistItem({ task, description, status, dueDate, completedAt, scheduledDate, onClick }) {
  const config = centralizedStatusConfig[status] ?? centralizedStatusConfig.Pending
  const Icon = statusIcons[status] || RadioButtonUnchecked
  const dueDateLabel = formatDateDisplay(dueDate)
  const scheduledLabel = formatDateDisplay(scheduledDate)
  const completedLabel = formatDateDisplay(completedAt)
  const dateDisplay = (() => {
    if (status === 'Completed') return completedLabel || ''
    if (status === 'Scheduled' || status === 'Overdue') return scheduledLabel || dueDateLabel || ''
    // Pending or In Progress: no date displayed
    return ''
  })()

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: '1px solid #DADCE0',
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#F8F9FA' },
      }}
      onClick={onClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 30 }}>
        <Icon sx={{ color: config.color, fontSize: 20 }} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>{task}</Typography>
        <Typography variant="body2" sx={{ color: '#5F6368', mt: 0.4 }}>{description}</Typography>
      </Box>

      <StatusChip label={status} />
      <Typography variant="body2" sx={{ color: '#5F6368', minWidth: 140, textAlign: 'right' }}>{dateDisplay}</Typography>
      <IconButton size="small" sx={{ border: '1px solid #DADCE0', borderRadius: 1 }}>
        <ChevronRight fontSize="small" />
      </IconButton>
    </Box>
  )
}

export default ChecklistItem
