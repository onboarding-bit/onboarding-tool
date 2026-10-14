import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from '@mui/icons-material'
import { Box, Card, Grid, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material'
import SummaryCard from '../../components/common/SummaryCard'
import EmployeeTable from '../../components/employees/EmployeeTable'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

function Employees() {
  const navigate = useNavigate()
  const { employees } = useEmployeesContext()
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('All')
  const [employmentType, setEmploymentType] = useState('All')
  const [status, setStatus] = useState('All')

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const display = getEmployeeDisplayName(employee)
      const searchText = `${display} ${employee.designation} ${employee.employeeId || ''} ${employee.personalEmail || employee.email || ''} ${employee.workEmail || ''}`.toLowerCase()
      const matchesSearch = searchText.includes(search.toLowerCase())
      const matchesDepartment = department === 'All' || employee.department === department
      const matchesType = employmentType === 'All' || employee.employmentType === employmentType
      const matchesStatus = status === 'All' || employee.status === status
      return matchesSearch && matchesDepartment && matchesType && matchesStatus
    })
  }, [search, department, employmentType, status])

  const cards = [
    { title: 'Total Employees', value: employees.length, detail: 'Registered workforce', accent: '#E8F0FE', color: '#1A73E8' },
    { title: 'Active', value: employees.filter((employee) => employee.lifecycleStage === 'Active').length, detail: 'Currently active', accent: '#E6F4EA', color: '#188038' },
    { title: 'Onboarding', value: employees.filter((employee) => employee.lifecycleStage === 'Onboarding').length, detail: 'Onboarding pipeline', accent: '#E8F0FE', color: '#1A73E8' },
    { title: 'Preboarding', value: employees.filter((employee) => employee.lifecycleStage === 'Preboarding').length, detail: 'Preboarding pipeline', accent: '#FFF4E5', color: '#F9AB00' },
  ]

  return (
    <Stack sx={{ p: { xs: 2, md: 3 }, gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
        <Box>
          <Typography variant="h3" sx={{ fontSize: '2rem' }}>Employee Directory</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>View and manage employee records.</Typography>
        </Box>
      </Stack>

      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <SummaryCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Card sx={{ p: 2, border: '1px solid #DADCE0' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search employees"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: '#5F6368' }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: { xs: '100%', md: 240 } }}
          />

          <TextField size="small" select label="Department" value={department} onChange={(event) => setDepartment(event.target.value)} sx={{ minWidth: 170 }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Analytics">Analytics</MenuItem>
          </TextField>

          <TextField size="small" select label="Employment Type" value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} sx={{ minWidth: 170 }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Full Time">Full Time</MenuItem>
            <MenuItem value="Intern">Intern</MenuItem>
          </TextField>

          <TextField size="small" select label="Status" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 170 }}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Preboarding">Preboarding</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </Stack>
      </Card>

      <EmployeeTable
        employees={filteredEmployees}
        onOpenEmployee={(id) => navigate(`/employees/${id}`)}
      />
    </Stack>
  )
}

export default Employees
