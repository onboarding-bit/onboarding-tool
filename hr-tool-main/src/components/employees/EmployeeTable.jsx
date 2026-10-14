import { ArrowForward } from '@mui/icons-material'
import { Box, Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import StatusChip from '../common/StatusChip'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

function EmployeeTable({ employees, onOpenEmployee }) {
  return (
    <TableContainer sx={{ border: '1px solid #DADCE0', borderRadius: 2, overflow: 'auto', backgroundColor: '#FFFFFF' }}>
      <Table size="small" sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
            <TableCell>Employee</TableCell>
            <TableCell>Employee ID</TableCell>
            <TableCell>Designation</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Joining Date</TableCell>
            <TableCell>Employment Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} hover sx={{ cursor: 'pointer' }} onClick={() => onOpenEmployee(employee.id)}>
              <TableCell>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  <Typography sx={{ width: 30, height: 30, borderRadius: '50%', backgroundColor: employee.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontWeight: 700, fontSize: '0.72rem' }}>
                    {employee.avatar}
                  </Typography>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{getEmployeeDisplayName(employee)}</Typography>
                    <Typography variant="caption" sx={{ color: '#5F6368' }}>{employee.personalEmail || employee.email}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>{employee.employeeId || employee.id}</TableCell>
              <TableCell>{employee.designation}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.joiningDate}</TableCell>
              <TableCell>{employee.employmentType}</TableCell>
              <TableCell>
                <StatusChip label={employee.status} />
              </TableCell>
              <TableCell align="right">
                <Button size="small" endIcon={<ArrowForward fontSize="small" />} onClick={(event) => {
                  event.stopPropagation()
                  onOpenEmployee(employee.id)
                }}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default EmployeeTable
