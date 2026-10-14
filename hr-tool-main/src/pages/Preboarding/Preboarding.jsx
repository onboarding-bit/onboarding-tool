import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Add } from '@mui/icons-material'
import { Box, Button, Snackbar, Stack, Typography } from '@mui/material'
import AddCandidateDialog from '../../components/preboarding/AddCandidateDialog'
import CandidateTable from '../../components/preboarding/CandidateTable'
import PreboardingFilters from '../../components/preboarding/PreboardingFilters'
import PreboardingSummaryCards from '../../components/preboarding/PreboardingSummaryCards'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeDisplayName } from '../../utils/nameUtils'
import { formatDateISO } from '../../utils/dateUtils'

function Preboarding() {
  const navigate = useNavigate()
  const { employees, addEmployee } = useEmployeesContext()
  const [search, setSearch] = useState('')
  const [joiningDate, setJoiningDate] = useState('All')
  const [employmentType, setEmploymentType] = useState('All')
  const [department, setDepartment] = useState('All')
  const [status, setStatus] = useState('All')
  const [openDialog, setOpenDialog] = useState(false)
  const [toastOpen, setToastOpen] = useState(false)

  const candidates = useMemo(() => {

  const getCreatedTimestamp =
    (value) => {

      if (!value) {
        return 0
      }

      const timestamp =
        new Date(
          value
        ).getTime()

      return Number.isFinite(
        timestamp
      )
        ? timestamp
        : 0
    }


  return employees
    .filter(
      (employee) =>
        employee.lifecycleStage ===
        'Preboarding'
    )
    .sort(
      (a, b) =>
        getCreatedTimestamp(
          b.Created_At
        ) -
        getCreatedTimestamp(
          a.Created_At
        )
    )

}, [employees])

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const display = getEmployeeDisplayName(candidate)
      const matchesSearch = `${display} ${candidate.designation}`.toLowerCase().includes(search.toLowerCase())

      const toDate = (d) => {
        const parsed = new Date(d)
        if (!isNaN(parsed.getTime())) return parsed
        const iso = formatDateISO(d)
        const parsedIso = new Date(iso)
        return isNaN(parsedIso.getTime()) ? null : parsedIso
      }

      const matchesDate = (() => {
        if (joiningDate === 'All') return true
        const jd = toDate(candidate.joiningDate)
        if (!jd) return false
        const now = new Date()
        if (joiningDate === 'This Week') {
          const start = new Date(now)
          start.setDate(now.getDate() - now.getDay())
          start.setHours(0, 0, 0, 0)
          const end = new Date(start)
          end.setDate(start.getDate() + 7)
          return jd >= start && jd < end
        }
        if (joiningDate === 'This Month') {
          return jd.getMonth() === now.getMonth() && jd.getFullYear() === now.getFullYear()
        }
        if (joiningDate === 'Next Month') {
          const nm = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          return jd.getMonth() === nm.getMonth() && jd.getFullYear() === nm.getFullYear()
        }
        return true
      })()

      const matchesType = employmentType === 'All' || candidate.employmentType === employmentType
      const matchesDepartment = department === 'All' || candidate.department === department
      const matchesStatus = status === 'All' || candidate.status === status

      return matchesSearch && matchesDate && matchesType && matchesDepartment && matchesStatus
    })
  }, [candidates, search, joiningDate, employmentType, department, status])

  const handleAddCandidate = (candidate) => {
    addEmployee(candidate)
    setToastOpen(true)
  }

  

  return (
    <Stack sx={{ p: { xs: 2, md: 3 }, gap: 3 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}>
        <Box>
          <Typography variant="h3" sx={{ fontSize: '2rem' }}>Preboarding</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>Manage candidates and pre-joining activities.</Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ backgroundColor: '#1A73E8', color: '#fff', '&:hover': { backgroundColor: '#1669c7' } }}
        >
          Add Candidate
        </Button>
      </Stack>

      <PreboardingSummaryCards candidates={candidates} />

      <PreboardingFilters
        search={search}
        onSearchChange={setSearch}
        joiningDate={joiningDate}
        onJoiningDateChange={setJoiningDate}
        employmentType={employmentType}
        onEmploymentTypeChange={setEmploymentType}
        department={department}
        onDepartmentChange={setDepartment}
        status={status}
        onStatusChange={setStatus}
      />

      <CandidateTable
        candidates={filteredCandidates}
        onOpenCandidate={(candidateId) => navigate(`/preboarding/${candidateId}`, { state: { initialTab: 'Preboarding' } })}
      />

      <AddCandidateDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmitCandidate={(candidate) => {
          handleAddCandidate(candidate)
          setOpenDialog(false)
        }}
      />

      

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
        message="Candidate added successfully."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  )
}

export default Preboarding
