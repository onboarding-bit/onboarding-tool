import { Card, Stack, Typography } from '@mui/material'

function DepartmentTasks({ data = [] }) {
  const maxValue = data.length ? Math.max(...data.map((item) => item.value)) : 1

  return (
    <Card sx={{ p: 2.5, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Tasks by Department</Typography>
        <Typography variant="caption" sx={{ color: '#1A73E8', fontWeight: 600 }}>View all</Typography>
      </Stack>

      <Stack spacing={2}>
        {data.map((item) => (
          <Stack key={item.department} spacing={0.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: '#202124' }}>{item.department}</Typography>
              <Typography variant="caption" sx={{ color: '#5F6368', fontWeight: 600 }}>{item.value}</Typography>
            </Stack>
            <Stack sx={{ height: 10, borderRadius: 999, backgroundColor: '#F1F3F4', overflow: 'hidden' }}>
              <Stack
                sx={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color,
                  borderRadius: 999,
                  height: '100%',
                }}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}

export default DepartmentTasks
