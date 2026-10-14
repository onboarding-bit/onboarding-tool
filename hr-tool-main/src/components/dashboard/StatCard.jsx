import { Card, Chip, Stack, Typography } from '@mui/material'

function StatCard({ title, value, subtitle, icon: Icon, color = '#1A73E8', trend = '' }) {
  return (
    <Card sx={{ p: 2.5, height: '100%', border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Stack spacing={1}>
          <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.2 }}>
            {value}
          </Typography>
        </Stack>

        <Stack sx={{ alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 2, backgroundColor: `${color}14`, color }}>
          <Icon fontSize="small" />
        </Stack>
      </Stack>

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body2" sx={{ color: '#5F6368' }}>{subtitle}</Typography>
        {trend && (
          <Chip
            label={trend}
            size="small"
            sx={{
              backgroundColor: '#E6F4EA',
              color: '#188038',
              fontWeight: 600,
              height: 24,
            }}
          />
        )}
      </Stack>
    </Card>
  )
}

export default StatCard
