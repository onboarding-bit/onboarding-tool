import { useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowBack } from '@mui/icons-material'
import { Avatar, Box, Button, Card, Chip, Grid, Stack, Tab, Tabs, Typography, Snackbar } from '@mui/material'
import PreboardingChecklist from '../../components/preboarding/PreboardingChecklist'
import AddCandidateDialog from '../../components/preboarding/AddCandidateDialog'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

const tabs = ['Overview', 'Preboarding', 'Onboarding', 'Documents', 'Timeline', 'Notes']

function PreboardingProfile() {
  const navigate = useNavigate()
  const { employeeId } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => (location.state && location.state.initialTab) || 'Overview')

  const formatJoiningDate = (value) => {
    if (!value) return '—'

    const text = String(value).trim()
    const dateOnlyMatch = text.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${monthNames[Number(month) - 1]} ${year}`
    }

    if (text.includes('T')) {
      const date = new Date(text)

      if (!Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          timeZone: 'Asia/Kolkata',
        }).format(date)
      }
    }

    return '—'
  }

  const { employees } = useEmployeesContext()

  const candidate = useMemo(
    () => employees.find((item) => item.id === employeeId),
    [employeeId, employees],
  )

  const [editOpen, setEditOpen] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  if (!candidate) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Card sx={{ p: 3, border: '1px solid #DADCE0' }}>
          <Typography variant="h6">Employee not found</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368', mt: 1 }}>The requested employee record does not exist.</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/preboarding')}>Back to Preboarding</Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button variant="text" startIcon={<ArrowBack />} onClick={() => navigate('/preboarding')}>Back to Preboarding</Button>
        <Button variant="outlined" onClick={() => setEditOpen(true)}>Edit Employee</Button>
      </Stack>

      <Card sx={{ p: 3, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)', mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#1A73E8', fontSize: '1.5rem', fontWeight: 700 }}>
              {getEmployeeDisplayName(candidate).split(' ').map((part) => part[0]).join('').slice(0, 2)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ mb: 0.5 }}>{getEmployeeDisplayName(candidate)}</Typography>
              <Typography variant="body1" sx={{ color: '#5F6368' }}>{candidate.designation}</Typography>
              <Chip label={candidate.lifecycleStage || candidate.status} size="small" sx={{ mt: 1.25, backgroundColor: '#E8F0FE', color: '#1A73E8', fontWeight: 600 }} />
            </Box>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>Employee ID</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{candidate.employeeId || candidate.id}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>Joining Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatJoiningDate(candidate.joiningDate)}</Typography>
            </Box>
          </Stack>
        </Stack>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="body2"><strong>Employment Type:</strong> {candidate.employmentType}</Typography>
              <Typography variant="body2"><strong>Department:</strong> {candidate.department}</Typography>
              <Typography variant="body2"><strong>Reporting Manager:</strong> {candidate.reportingManager || candidate.Reporting_Manager || '—'}</Typography>
              <Typography variant="body2"><strong>Work Location:</strong> {candidate.workLocation || candidate.Work_Location || '—'}</Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1.5}>
              <Typography variant="body2"><strong>Manager:</strong> Anushka HR</Typography>
              <Typography variant="body2"><strong>Buddy:</strong> Rahul Sharma</Typography>
              <Typography variant="body2"><strong>Personal Email:</strong> {candidate.personalEmail || candidate.email || 'candidate@company.com'}</Typography>
              <Typography variant="body2"><strong>Employee Mail ID:</strong> {candidate.workEmail || '—'}</Typography>
              <Typography variant="body2"><strong>Phone:</strong> {candidate.phone || '+91 98765 43210'}</Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          {(() => {
            const completedCount = candidate?.completedTasks || 0
            const total = candidate?.totalTasks || 0
            const percentage = candidate?.progress || 0
            return (
              <>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>Overall Progress</Typography>
                  <Typography variant="body2" sx={{ color: '#1A73E8', fontWeight: 700 }}>{percentage}%</Typography>
                </Stack>
                <Box sx={{ height: 10, borderRadius: 999, backgroundColor: '#F1F3F4', overflow: 'hidden' }}>
                  <Box sx={{ width: `${percentage}%`, height: '100%', borderRadius: 999, backgroundColor: '#1A73E8' }} />
                </Box>
                <Typography variant="caption" sx={{ color: '#5F6368', mt: 1, display: 'block' }}>{completedCount} of {total} tasks completed</Typography>
              </>
            )
          })()}
        </Box>
      </Card>

      <Card sx={{ border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <Tabs value={activeTab} onChange={(event, value) => setActiveTab(value)} variant="scrollable" sx={{ borderBottom: '1px solid #DADCE0', px: 2, pt: 1 }}>
          {tabs.map((tab) => (
            <Tab key={tab} label={tab} value={tab} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 'Overview' && (
            <Stack spacing={2}>
              <Typography variant="body1">Candidate details overview and current preboarding status.</Typography>
              <Typography variant="body2" sx={{ color: '#5F6368' }}>Employment type: {candidate.employmentType}</Typography>
            </Stack>
          )}

          {activeTab === 'Preboarding' && (
            <PreboardingChecklist candidate={candidate} />
          )}

          {activeTab !== 'Overview' && activeTab !== 'Preboarding' && (
            <Typography variant="body2" sx={{ color: '#5F6368' }}>{activeTab} placeholder content for future employee lifecycle workflow details.</Typography>
          )}
        </Box>
      </Card>

      <AddCandidateDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        employee={candidate}
        onSave={() => { setToastOpen(true); setEditOpen(false); setTimeout(() => setToastOpen(false), 2000) }}
      />

      <Snackbar open={toastOpen} message="Employee details updated successfully." anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </Box>
  )
}

export default PreboardingProfile
