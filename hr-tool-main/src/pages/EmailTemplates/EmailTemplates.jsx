import { useState } from 'react'
import { Add, Delete, Edit, FileCopy, Search, Visibility } from '@mui/icons-material'
import { Box, Button, Card, Chip, Grid, InputAdornment, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { emailTemplates } from '../../data/emailTemplates'

const categoryList = ['All Templates', 'Preboarding', 'Onboarding', 'Offboarding']

function EmailTemplates() {
  const [selectedCategory, setSelectedCategory] = useState('All Templates')
  const [template, setTemplate] = useState(emailTemplates[0])

  const visibleTemplates = selectedCategory === 'All Templates'
    ? emailTemplates
    : emailTemplates.filter((item) => item.category === selectedCategory)

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontSize: '2rem' }}>Email Templates</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>Create, manage and reuse communication templates across the employee lifecycle.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>+ New Template</Button>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ p: 2.5, border: '1px solid #DADCE0' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
            <Stack spacing={1}>
              {categoryList.map((category) => (
                <Button key={category} variant={selectedCategory === category ? 'contained' : 'text'} onClick={() => setSelectedCategory(category)} sx={{ justifyContent: 'flex-start' }}>
                  {category}
                </Button>
              ))}
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ p: 2.5, border: '1px solid #DADCE0' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 2 }}>
              <Typography variant="h6">Templates</Typography>
              <TextField
                size="small"
                placeholder="Search templates..."
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Search fontSize="small" sx={{ color: '#5F6368' }} /></InputAdornment>,
                  },
                }}
              />
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Template Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Trigger</TableCell>
                    <TableCell>Last Updated</TableCell>
                    <TableCell>Updated By</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleTemplates.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.trigger}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell>{item.updatedBy}</TableCell>
                      <TableCell>
                        <Chip label={item.status} size="small" sx={{ backgroundColor: item.status === 'Active' ? '#E6F4EA' : '#F1F3F4', color: item.status === 'Active' ? '#188038' : '#5F6368', fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Button size="small" variant="text"><Visibility fontSize="small" /></Button>
                          <Button size="small" variant="text"><Edit fontSize="small" /></Button>
                          <Button size="small" variant="text"><FileCopy fontSize="small" /></Button>
                          <Button size="small" variant="text" color="error"><Delete fontSize="small" /></Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3, p: 3, border: '1px solid #DADCE0' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Template Editor</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Template Name" value={template.name} onChange={(event) => setTemplate({ ...template, name: event.target.value })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Category" value={template.category} onChange={(event) => setTemplate({ ...template, category: event.target.value })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Trigger" value={template.trigger} onChange={(event) => setTemplate({ ...template, trigger: event.target.value })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Recipients" value={template.recipients} onChange={(event) => setTemplate({ ...template, recipients: event.target.value })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="CC" value={template.cc} onChange={(event) => setTemplate({ ...template, cc: event.target.value })} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Subject" value={template.subject} onChange={(event) => setTemplate({ ...template, subject: event.target.value })} /></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth multiline minRows={7} label="Email Body" value={template.body} onChange={(event) => setTemplate({ ...template, body: event.target.value })} /></Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#5F6368', mb: 1 }}>Supported placeholders:</Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {['{{employee_name}}', '{{joining_date}}', '{{designation}}', '{{department}}', '{{manager_name}}', '{{employee_email}}', '{{buddy_name}}'].map((placeholder) => (
              <Chip key={placeholder} label={placeholder} size="small" sx={{ backgroundColor: '#E8F0FE', color: '#1A73E8' }} />
            ))}
          </Stack>
        </Box>
      </Card>
    </Box>
  )
}

export default EmailTemplates
