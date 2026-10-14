import { Box, Card, Chip, IconButton, Stack, Typography } from '@mui/material'
import { CheckCircle, ChevronRight, RadioButtonUnchecked, WarningAmber } from '@mui/icons-material'

const statusConfig = {
  Completed: { color: '#E6F4EA', text: '#188038', icon: CheckCircle },
  'In Progress': { color: '#E8F0FE', text: '#1A73E8', icon: WarningAmber },
  Pending: { color: '#F1F3F4', text: '#5F6368', icon: RadioButtonUnchecked },
}

function ChecklistItem({ task, description, status, dueDate, index }) {
  const config = statusConfig[status] ?? statusConfig.Pending
  const Icon = config.icon

  return (
    <Card
      variant="outlined"
      sx={{
        p: 2,
        borderColor: '#DADCE0',
        backgroundColor: '#FFFFFF',
        mb: 1.25,
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 30 }}>
          <Icon sx={{ color: config.text, fontSize: 20 }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>{task}</Typography>
            <Typography variant="caption" sx={{ color: '#5F6368' }}>#{index}</Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: '#5F6368', mt: 0.5 }}>{description}</Typography>
        </Box>

        <Chip
          label={status}
          size="small"
          sx={{
            backgroundColor: config.color,
            color: config.text,
            fontWeight: 600,
            height: 28,
          }}
        />

        <Typography variant="body2" sx={{ color: '#5F6368', minWidth: 110, textAlign: 'right' }}>
          {dueDate}
        </Typography>

        <IconButton size="small" sx={{ border: '1px solid #DADCE0', borderRadius: 1 }}>
          <ChevronRight fontSize="small" />
        </IconButton>
      </Stack>
    </Card>
  )
}

export default ChecklistItem
