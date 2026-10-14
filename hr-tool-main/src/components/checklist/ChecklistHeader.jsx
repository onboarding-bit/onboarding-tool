import { Box, LinearProgress, Stack, Typography } from '@mui/material'

function ChecklistHeader({ title, completed, total, description }) {
  const percentage = Math.round((completed / total) * 100)

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>{title}</Typography>
          {description && (
            <Typography variant="body2" sx={{ color: '#5F6368' }}>{description}</Typography>
          )}
        </Box>

        <Box sx={{ minWidth: { xs: '100%', md: 260 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{percentage}%</Typography>
            <Typography variant="caption" sx={{ color: '#5F6368' }}>{completed} of {total} tasks completed</Typography>
          </Stack>
          <LinearProgress variant="determinate" value={percentage} sx={{ height: 8, borderRadius: 999, backgroundColor: '#E8EAED', '& .MuiLinearProgress-bar': { borderRadius: 999, backgroundColor: '#1A73E8' } }} />
        </Box>
      </Stack>
    </Box>
  )
}

export default ChecklistHeader
