import { Box, Card, Grid, Stack, Typography } from '@mui/material'

function PreboardingSummaryCards({ candidates = [] }) {
  const pendingTaskCount = candidates.reduce((total, candidate) => {
    const tasks = candidate.preboardingTasks || []

    const openTasks = tasks.filter(
      (task) =>
        String(task.Status || task.status || '')
          .trim()
          .toLowerCase() !== 'completed'
    ).length

    return total + openTasks
  }, 0)

  const cards = [
    {
      label: 'Upcoming Joinings',
      value: candidates.length,
      detail: 'Scheduled in the next 30 days',
      accent: '#E8F0FE',
      color: '#1A73E8',
    },
    {
      label: 'In Progress',
      value: candidates.filter((candidate) => candidate.status === 'In Progress').length,
      detail: 'Active preboarding checks',
      accent: '#E6F4EA',
      color: '#188038',
    },
    {
      label: 'Ready to Join',
      value: candidates.filter((candidate) => candidate.status === 'Ready').length,
      detail: 'Final approvals complete',
      accent: '#F1F3F4',
      color: '#5F6368',
    },
    {
      label: 'Pending Tasks',
      value: pendingTaskCount,
      detail: 'Action required',
      accent: '#FFF4E5',
      color: '#F9AB00',
    },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 2.25, border: '1px solid #DADCE0', height: '100%' }}>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {card.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1, fontSize: '2rem', fontWeight: 600 }}>
                  {card.value}
                </Typography>
              </Box>
              <Box sx={{ width: 42, height: 42, borderRadius: 2, backgroundColor: card.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color, fontWeight: 700 }}>
                {card.value}
              </Box>
            </Stack>
            <Typography variant="body2" sx={{ color: '#5F6368', mt: 1.5 }}>
              {card.detail}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default PreboardingSummaryCards