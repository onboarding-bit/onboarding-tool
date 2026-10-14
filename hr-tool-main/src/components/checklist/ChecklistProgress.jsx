import { Box, LinearProgress, Stack, Typography } from '@mui/material'

function ChecklistProgress({ completed, total, label }) {
  const value = Math.round((completed / total) * 100)

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body2" sx={{ color: '#1A73E8', fontWeight: 700 }}>{value}%</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={value} sx={{ height: 8, borderRadius: 999, backgroundColor: '#E8EAED', '& .MuiLinearProgress-bar': { borderRadius: 999, backgroundColor: '#1A73E8' } }} />
    </Box>
  )
}

export default ChecklistProgress
