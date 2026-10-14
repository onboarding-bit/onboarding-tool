import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material'
import { ArrowBack, Edit } from '@mui/icons-material'

function EmployeeHeader({ employee, onBack }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3 }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button variant="outlined" startIcon={<ArrowBack />} onClick={onBack}>
          Back to Directory
        </Button>
        <Typography variant="h4">Employee Profile — Overview</Typography>
      </Stack>

      <Button variant="contained" startIcon={<Edit />}>
        Edit Employee
      </Button>
    </Box>
  )
}

export default EmployeeHeader
