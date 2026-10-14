import { Card, Stack, Typography } from '@mui/material'

function SummaryCard({ title, value, detail, accent = '#E8F0FE', color = '#1A73E8' }) {
  return (
    <Card sx={{ p: 2.25, border: '1px solid #DADCE0', height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={0.75}>
          <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            minWidth: 42,
            height: 42,
            borderRadius: 2,
            backgroundColor: accent,
            color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </Stack>

      <Typography variant="body2" sx={{ color: '#5F6368', mt: 1.5 }}>
        {detail}
      </Typography>
    </Card>
  )
}

export default SummaryCard
