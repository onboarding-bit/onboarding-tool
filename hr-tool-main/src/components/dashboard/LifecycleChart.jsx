import { Box, Card, Stack, Typography } from '@mui/material'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function LifecycleChart({ summary = [], title = 'Preboarding Progress' }) {
  const data = {
    labels: summary.map((item) => item.label),
    datasets: [
      {
        data: summary.map((item) => item.value),
        backgroundColor: summary.map((item) => item.color),
        borderWidth: 0,
        cutout: '72%',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  }

  return (
    <Card sx={{ p: 2.5, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="caption" sx={{ color: '#1A73E8', fontWeight: 600 }}>View report</Typography>
      </Stack>

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Box sx={{ width: 180, height: 180 }}>
          <Doughnut data={data} options={options} />
        </Box>

        <Stack spacing={1} sx={{ flex: 1 }}>
          {summary.map((item) => (
            <Stack key={item.label} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                <Typography variant="body2">{item.label}</Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.value}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
}

export default LifecycleChart
