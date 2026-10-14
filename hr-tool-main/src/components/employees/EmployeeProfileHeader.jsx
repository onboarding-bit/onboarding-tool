import { ArrowBack } from '@mui/icons-material'
import { Avatar, Box, Button, Card, Chip, Stack, Typography } from '@mui/material'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

function EmployeeProfileHeader({ employee, onBack }) {
  return (
    <Card sx={{ p: 3, border: '1px solid #DADCE0', mb: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
        <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: 72, height: 72, backgroundColor: employee.accent, fontWeight: 700 }}>
            {employee.avatar}
          </Avatar>

            <Box>
            <Typography variant="h4" sx={{ fontSize: '1.8rem', fontWeight: 600 }}>{getEmployeeDisplayName(employee)}</Typography>
            <Typography variant="body1" sx={{ color: '#5F6368' }}>{employee.designation}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
              <Chip label={employee.employmentType} size="small" sx={{ backgroundColor: '#E8F0FE', color: '#1A73E8', fontWeight: 600 }} />
              <Chip label={employee.department} size="small" sx={{ backgroundColor: '#E6F4EA', color: '#188038', fontWeight: 600 }} />
              <Chip label={employee.joiningDate} size="small" sx={{ backgroundColor: '#F1F3F4', color: '#5F6368', fontWeight: 600 }} />
            </Stack>
          </Box>
        </Stack>

        <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
          Back to Directory
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#5F6368' }}>Manager</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{employee.manager}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#5F6368' }}>Buddy</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{employee.buddy}</Typography>
        </Box>
        <Box>
          <Typography variant="caption" sx={{ color: '#5F6368' }}>Status</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>{employee.status}</Typography>
        </Box>
      </Stack>
    </Card>
  )
}

export default EmployeeProfileHeader
