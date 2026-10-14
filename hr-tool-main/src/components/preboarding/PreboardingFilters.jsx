import { Box, MenuItem, Stack, TextField } from '@mui/material'

function PreboardingFilters({ search, onSearchChange, joiningDate, onJoiningDateChange, employmentType, onEmploymentTypeChange, department, onDepartmentChange, status, onStatusChange }) {
  return (
    <Box sx={{ p: 2.5, border: '1px solid #DADCE0', backgroundColor: '#FFFFFF', borderRadius: 2, mb: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          size="small"
          label="Search candidates"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          sx={{ minWidth: { xs: '100%', md: 220 } }}
        />

        <TextField
          size="small"
          select
          label="Joining Date"
          value={joiningDate}
          onChange={(event) => onJoiningDateChange(event.target.value)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="Next Month">Next Month</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          label="Employment Type"
          value={employmentType}
          onChange={(event) => onEmploymentTypeChange(event.target.value)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Full Time">Full Time</MenuItem>
          <MenuItem value="Intern">Intern</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          label="Department"
          value={department}
          onChange={(event) => onDepartmentChange(event.target.value)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Engineering">Engineering</MenuItem>
          <MenuItem value="Design">Design</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Analytics">Analytics</MenuItem>
          <MenuItem value="HR">HR</MenuItem>
        </TextField>

        <TextField
          size="small"
          select
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={{ minWidth: 170 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="In Progress">In Progress</MenuItem>
          <MenuItem value="Ready">Ready</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </TextField>
      </Stack>
    </Box>
  )
}

export default PreboardingFilters
