import { Box, LinearProgress, Stack, Typography } from '@mui/material'

function ProgressBar({ value, label, showLabel = true, height = 8, sx = {} }) {
  const safeValue = Math.min(Math.max(value ?? 0, 0), 100)

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      {showLabel && (
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{label ?? 'Progress'}</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368', fontWeight: 600 }}>{safeValue}%</Typography>
        </Stack>
      )}
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant="determinate"
          value={safeValue}
          sx={{
            height,
            borderRadius: 999,
            backgroundColor: '#E8EAED',
            '& .MuiLinearProgress-bar': {
              borderRadius: 999,
              backgroundColor: '#1A73E8',
            },
            ...sx,
          }}
        />
      </Box>
    </Stack>
  )
}

export default ProgressBar
