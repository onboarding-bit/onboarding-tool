import { Card, Grid, Stack, Typography } from '@mui/material'
import { Assessment, BusinessCenter, Group, PendingActions, PersonAdd } from '@mui/icons-material'
import StatCard from '../../components/dashboard/StatCard'
import UpcomingJoinings from '../../components/dashboard/UpcomingJoinings'
import RecentActivities from '../../components/dashboard/RecentActivities'
import LifecycleChart from '../../components/dashboard/LifecycleChart'
import DepartmentTasks from '../../components/dashboard/DepartmentTasks'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { recentActivities } from '../../data/employees'
import { getUpcomingJoinings, getLifecycleStats, getStatusSummary, getDepartmentTaskData } from '../../utils/lifecycleUtils'

function Dashboard() {
  const { employees } = useEmployeesContext()
  const lifecycleStats = getLifecycleStats(employees)
  const preboardingSummary = getStatusSummary(employees, 'Preboarding')
  const upcomingRows = getUpcomingJoinings(employees)
  const departmentData = getDepartmentTaskData(employees)

  const stats = [
    { title: 'Preboarding', value: lifecycleStats.preboarding, subtitle: 'Current pipeline', icon: PersonAdd, color: '#1A73E8', trend: '+2%' },
    { title: 'Onboarding', value: lifecycleStats.onboarding, subtitle: 'Current pipeline', icon: BusinessCenter, color: '#188038', trend: '+1%' },
    { title: 'Active Employees', value: lifecycleStats.active, subtitle: 'Currently employed', icon: Group, color: '#1A73E8', trend: '+5%' },
    { title: 'Offboarding', value: lifecycleStats.offboarding, subtitle: 'Pending exits', icon: PendingActions, color: '#F9AB00', trend: '-1%' },
    { title: 'Total Employees', value: lifecycleStats.total, subtitle: 'All employee records', icon: Assessment, color: '#5F6368', trend: '+4%' },
  ]

  return (
    <Stack sx={{ p: { xs: 2, md: 3 }, gap: 3 }}>
      <Stack spacing={0.5}>
        <Typography variant="h3" sx={{ fontSize: '2rem' }}>Dashboard Overview</Typography>
        <Typography variant="body1" sx={{ color: '#5F6368' }}>Welcome back, Anushka! Here's what's happening with your team.</Typography>
      </Stack>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid key={stat.title} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <UpcomingJoinings rows={upcomingRows} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <RecentActivities items={recentActivities} />
        </Grid>

        <Grid size={{ xs: 12, md: 5.5 }}>
          <LifecycleChart
            summary={[
              { label: 'Completed', value: preboardingSummary.completed, color: '#1A73E8' },
              { label: 'In Progress', value: preboardingSummary.inProgress, color: '#188038' },
              { label: 'Pending', value: preboardingSummary.pending, color: '#DADCE0' },
            ]}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6.5 }}>
          <DepartmentTasks data={departmentData} />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default Dashboard
