import { ArrowForward } from '@mui/icons-material'
import { Box, Button, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { getEmployeeDisplayName } from '../../utils/nameUtils'
import { getEmployeeProgress } from '../../utils/lifecycleUtils'
import { statusConfig as centralizedStatusConfig } from '../common/StatusChip'

function CandidateTable({ candidates, onOpenCandidate, onEditCandidate }) {
  return (
    <TableContainer sx={{ border: '1px solid #DADCE0', borderRadius: 2, backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
            <TableCell>Candidate</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Joining Date</TableCell>
            <TableCell>Employment Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Progress</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {candidates.map((candidate) => {
            const statusStyle = centralizedStatusConfig[candidate.status] ?? centralizedStatusConfig.Pending
            const display = getEmployeeDisplayName(candidate)
            const initials = (display || '').split(' ').map((part) => part[0] || '').join('').slice(0, 2)

            return (
              <TableRow key={candidate.id} hover sx={{ cursor: 'pointer' }} onClick={() => onOpenCandidate(candidate.id)}>
                <TableCell>
                  <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: '#1A73E8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem' }}>
                      {initials}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{display}</Typography>
                      <Typography variant="caption" sx={{ color: '#5F6368' }}>{candidate.employeeId || candidate.id}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>{candidate.designation}</TableCell>
                <TableCell>{candidate.joiningDate}</TableCell>
                <TableCell>{candidate.employmentType}</TableCell>
                <TableCell>{candidate.department}</TableCell>
                <TableCell>
                  {(() => {
                    const prog = getEmployeeProgress(candidate)
                    return (
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ color: '#5F6368' }}>{prog}%</Typography>
                        <Box sx={{ width: 100, height: 8, backgroundColor: '#E8EAED', borderRadius: 999, overflow: 'hidden' }}>
                          <Box sx={{ width: `${prog}%`, height: '100%', backgroundColor: '#1A73E8', borderRadius: 999 }} />
                        </Box>
                      </Stack>
                    )
                  })()}
                </TableCell>
                <TableCell>
                  <Chip label={candidate.status} size="small" sx={{ backgroundColor: statusStyle.backgroundColor, color: statusStyle.color, fontWeight: 600 }} />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" endIcon={<ArrowForward fontSize="small" />} onClick={(event) => { event.stopPropagation(); onOpenCandidate(candidate.id) }}>
                    Open
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CandidateTable
