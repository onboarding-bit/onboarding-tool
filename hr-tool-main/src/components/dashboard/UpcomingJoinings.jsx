import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { getEmployeeDisplayName } from '../../utils/nameUtils'

function UpcomingJoinings({ rows }) {
  return (
    <Card sx={{ p: 2.5, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Upcoming Joinings</Typography>
        <Typography variant="caption" sx={{ color: '#1A73E8', fontWeight: 600 }}>View all</Typography>
      </Stack>

      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>DOJ</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>{getEmployeeDisplayName(row)}</TableCell>
                <TableCell>{row.designation}</TableCell>
                <TableCell>{row.joiningDate}</TableCell>
                <TableCell>{row.employmentType}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      backgroundColor: row.status === 'Pending' ? '#F1F3F4' : row.status === 'In Progress' ? '#E8F0FE' : '#E6F4EA',
                      color: row.status === 'Pending' ? '#5F6368' : row.status === 'In Progress' ? '#1A73E8' : '#188038',
                      fontWeight: 600,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  )
}

export default UpcomingJoinings
