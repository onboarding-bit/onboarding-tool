import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { Bar, Line } from 'react-chartjs-2'
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, PointElement, Tooltip, BarElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend)

function Reports() {
  const overview = [
    { label: 'New Joinings', value: 12 },
    { label: 'Exits', value: 2 },
    { label: 'Pending Tasks', value: 18 },
    { label: 'Average Onboarding Time', value: '5.2 days' },
  ]

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Joinings',
      data: [4, 5, 8, 7, 10, 9, 12, 15],
      borderColor: '#1A73E8',
      backgroundColor: 'rgba(26, 115, 232, 0.12)',
      fill: true,
      tension: 0.35,
    }],
  }

  const barData = {
    labels: ['Engineering', 'Marketing', 'Design', 'Finance', 'Sales'],
    datasets: [{
      label: 'Tasks',
      data: [12, 8, 5, 4, 3],
      backgroundColor: ['#1A73E8', '#5F6368', '#188038', '#F9AB00', '#D93025'],
    }],
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h3" sx={{ fontSize: '2rem' }}>Reports & Analytics</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>Operational insights across the employee lifecycle.</Typography>
        </Box>

        <Grid container spacing={2}>
          {overview.map((item) => (
            <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card sx={{ p: 2.5, border: '1px solid #DADCE0' }}>
                <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>{item.value}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 2.5, border: '1px solid #DADCE0' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Joining Trend</Typography>
              <Box sx={{ height: 260 }}><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} /></Box>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Card sx={{ p: 2.5, border: '1px solid #DADCE0' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Task by Department</Typography>
              <Box sx={{ height: 260 }}><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></Box>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}

export default Reports
