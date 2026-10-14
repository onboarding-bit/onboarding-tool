import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Business, CalendarToday, Email, InsertDriveFile, LocationOn, Phone, Schedule, UploadFile, PersonAdd } from '@mui/icons-material'
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material'
import EmployeeProfileHeader from '../../components/employees/EmployeeProfileHeader'
import EmployeeTabs from '../../components/employees/EmployeeTabs'
import Checklist from '../../components/checklist/Checklist'
import ProgressBar from '../../components/common/ProgressBar'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeProgress } from '../../utils/lifecycleUtils'

const tabs = ['Overview', 'Preboarding', 'Onboarding', 'Documents', 'Timeline', 'Notes']

function EmployeeProfile() {
  const navigate = useNavigate()
  const { employeeId } = useParams()
  const [activeTab, setActiveTab] = useState('Overview')

  const { employees } = useEmployeesContext()

  const employee = useMemo(
    () => employees.find((item) => item.id === employeeId) ?? employees[0],
    [employeeId, employees],
  )

  const quickActions = [
    { label: 'Send Email', icon: Email },
    { label: 'Schedule Meeting', icon: Schedule },
    { label: 'Create Workspace User', icon: PersonAdd },
    { label: 'Upload Document', icon: UploadFile },
    { label: 'Add Note', icon: InsertDriveFile },
  ]

  const overviewDetails = [
    { label: 'Email', value: employee.email, icon: Email },
    { label: 'Phone', value: employee.phone, icon: Phone },
    { label: 'Location', value: employee.location, icon: LocationOn },
    { label: 'Date of Birth', value: employee.dateOfBirth, icon: CalendarToday },
    { label: 'Gender', value: employee.gender, icon: Business },
  ]

  const checklistItems = useMemo(() => {
    if (activeTab === 'Preboarding') return employee.preboardingChecklist || []
    if (activeTab === 'Onboarding') return employee.onboardingChecklist || []
    return []
  }, [activeTab, employee])

  const jobDetails = [
    { label: 'Designation', value: employee.designation },
    { label: 'Department', value: employee.department },
    { label: 'Reporting Manager', value: employee.manager },
    { label: 'Band / Level', value: 'L3' },
    { label: 'Work Location', value: employee.location },
    { label: 'Employment Type', value: employee.employmentType },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Employee Directory / {employee.id}
        </Typography>
      </Stack>

      <EmployeeProfileHeader employee={employee} onBack={() => navigate('/employees')} />

      <Card sx={{ p: 3, border: '1px solid #DADCE0', mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Overall Progress</Typography>
            <ProgressBar value={getEmployeeProgress(employee)} label={getEmployeeProgress(employee) + '%'} showLabel={false} />
          </Box>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>{getEmployeeProgress(employee)}% complete</Typography>
        </Stack>
      </Card>

      <Card sx={{ border: '1px solid #DADCE0' }}>
        <EmployeeTabs value={activeTab} onChange={(event, value) => setActiveTab(value)} tabs={tabs} />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {activeTab === 'Overview' && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Personal Information</Typography>
                  <Stack spacing={1.75}>
                    {overviewDetails.map(({ label, value, icon: Icon }) => (
                      <Stack key={label} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Icon sx={{ color: '#5F6368', fontSize: 18 }} />
                        <Typography variant="body2">
                          <strong>{label}:</strong> {value}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 2.5, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Job Information</Typography>
                  <Stack spacing={1.5}>
                    {jobDetails.map(({ label, value }) => (
                      <Typography key={label} variant="body2">
                        <strong>{label}:</strong> {value}
                      </Typography>
                    ))}
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2.5 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {quickActions.map(({ label, icon: Icon }) => (
                      <Button key={label} variant="outlined" startIcon={<Icon fontSize="small" />}>
                        {label}
                      </Button>
                    ))}
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === 'Preboarding' && (
            <Checklist
              title="Preboarding Checklist"
              subtitle="Track candidate readiness and required onboarding preparation."
              items={employee.preboardingChecklist || []}
            />
          )}

          {activeTab === 'Onboarding' && (
            <Checklist
              title="Onboarding Checklist"
              subtitle="Track first-week onboarding activities and access setup."
              items={employee.onboardingChecklist || []}
            />
          )}

          {activeTab === 'Documents' && (
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Documents</Typography>
              <Typography variant="body2" sx={{ color: '#5F6368' }}>No documents uploaded yet for this employee.</Typography>
            </Card>
          )}

          {activeTab === 'Timeline' && (
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Timeline</Typography>
              <Typography variant="body2" sx={{ color: '#5F6368' }}>Candidate and onboarding milestones will appear here.</Typography>
            </Card>
          )}

          {activeTab === 'Notes' && (
            <Card variant="outlined" sx={{ p: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>Notes</Typography>
              <Typography variant="body2" sx={{ color: '#5F6368' }}>No detailed notes recorded for this employee yet.</Typography>
            </Card>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default EmployeeProfile
