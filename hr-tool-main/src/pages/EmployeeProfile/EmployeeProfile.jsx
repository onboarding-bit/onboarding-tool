import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Avatar, Box, Button, Card, Chip, Divider, Grid, Stack, Tab, Tabs, TextField, Typography } from '@mui/material'
import { CalendarToday, Email, Groups, InsertDriveFile, LocationOn, Phone, PersonAdd, Schedule, UploadFile } from '@mui/icons-material'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

const tabs = ['Overview', 'Preboarding', 'Onboarding', 'Documents', 'Timeline', 'Notes']

function EmployeeProfile() {
  const navigate = useNavigate()
  const { employeeId } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')
  const { employees } = useEmployeesContext()

  const employee = useMemo(
    () => employees.find((e) => e.id === employeeId) ?? employees[0],
    [employeeId, employees],
  )

  const quickActions = [
    { label: 'Send Email', icon: Email },
    { label: 'Schedule Meeting', icon: Schedule },
    { label: 'Create Workspace User', icon: PersonAdd },
    { label: 'Upload Document', icon: UploadFile },
    { label: 'Add Note', icon: InsertDriveFile },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Employee Directory / {employee.id}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            Employee Profile — Overview
          </Typography>
        </Box>

        <Button variant="contained" onClick={() => navigate('/employees')}>
          Back to Directory
        </Button>
      </Stack>

      <Card sx={{ p: 3, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)', mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
              <Avatar sx={{ width: 76, height: 76, bgcolor: employee.accent, fontSize: '1.75rem', fontWeight: 700 }}>
              {employee.avatar}
            </Avatar>

            <Box>
              <Typography variant="h4" sx={{ mb: 0.5 }}>{getEmployeeDisplayName(employee)}</Typography>
              <Typography variant="body1" sx={{ color: '#5F6368' }}>{employee.designation}</Typography>
              <Stack direction="row" spacing={1.5} sx={{ mt: 1.25, flexWrap: 'wrap' }}>
                <Chip label={employee.id} size="small" sx={{ backgroundColor: '#F1F3F4', color: '#202124' }} />
                <Chip label={employee.employmentType} size="small" sx={{ backgroundColor: '#E8F0FE', color: '#1A73E8' }} />
                <Chip label={employee.department} size="small" sx={{ backgroundColor: '#E6F4EA', color: '#188038' }} />
              </Stack>
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>Manager</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{employee.manager}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>Buddy</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{employee.buddy}</Typography>
            </Box>
          </Stack>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Overall Progress</Typography>
            <Typography variant="body2" sx={{ color: '#1A73E8', fontWeight: 700 }}>60%</Typography>
          </Stack>
          <Box sx={{ height: 10, borderRadius: 999, backgroundColor: '#F1F3F4', overflow: 'hidden' }}>
            <Box sx={{ width: '60%', height: '100%', borderRadius: 999, backgroundColor: '#1A73E8' }} />
          </Box>
        </Box>
      </Card>

      <Card sx={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={(event, value) => setActiveTab(value)}
          variant="scrollable"
          sx={{ borderBottom: '1px solid #DADCE0', px: 2, pt: 1 }}
        >
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 'Overview' && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
                  <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', gap: 1 }}><Phone fontSize="small" sx={{ color: '#5F6368' }} /><Typography variant="body2">{employee.phone}</Typography></Box>
                    <Box sx={{ display: 'flex', gap: 1 }}><Email fontSize="small" sx={{ color: '#5F6368' }} /><Typography variant="body2">{employee.personalEmail || employee.email}</Typography></Box>
                    <Box sx={{ display: 'flex', gap: 1 }}><LocationOn fontSize="small" sx={{ color: '#5F6368' }} /><Typography variant="body2">{employee.location}</Typography></Box>
                    <Box sx={{ display: 'flex', gap: 1 }}><CalendarToday fontSize="small" sx={{ color: '#5F6368' }} /><Typography variant="body2">Date of Birth: {employee.dateOfBirth}</Typography></Box>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Job Information</Typography>
                  <Stack spacing={1.5}>
                    <Typography variant="body2"><strong>Designation:</strong> {employee.designation}</Typography>
                    <Typography variant="body2"><strong>Department:</strong> {employee.department}</Typography>
                    <Typography variant="body2"><strong>Employment Type:</strong> {employee.employmentType}</Typography>
                    <Typography variant="body2"><strong>Joining Date:</strong> {employee.joiningDate}</Typography>
                    <Typography variant="body2"><strong>Manager:</strong> {employee.manager}</Typography>
                    <Typography variant="body2"><strong>Buddy:</strong> {employee.buddy}</Typography>
                  </Stack>
                </Card>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Stack direction="row" spacing={1.5} useFlexGap flexWrap="wrap">
                    {quickActions.map((action) => {
                      const Icon = action.icon
                      return (
                        <Button key={action.label} variant="outlined" startIcon={<Icon fontSize="small" />}>
                          {action.label}
                        </Button>
                      )
                    })}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 'Preboarding' && (
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Preboarding workflow for {getEmployeeDisplayName(employee)} is available in the checklist section.
            </Alert>
          )}

          {activeTab !== 'Overview' && activeTab !== 'Preboarding' && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              {activeTab} tab for {getEmployeeDisplayName(employee)} is ready for future lifecycle workflow details.
            </Alert>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default EmployeeProfile
