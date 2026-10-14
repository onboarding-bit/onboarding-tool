import { Box, Card, Stack } from '@mui/material'
import ChecklistHeader from '../../components/checklist/ChecklistHeader'
import ChecklistItem from '../../components/checklist/ChecklistItem'
import { offboardingChecklist } from '../../data/offboardingData'

function Offboarding() {
  const completedCount = offboardingChecklist.filter((task) => task.status === 'Completed').length

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <ChecklistHeader title="Offboarding Checklist" completed={completedCount} total={offboardingChecklist.length} description="Manage exit planning and handover tasks." />
      <Card sx={{ p: 2.5, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
        <Stack spacing={1}>
          {offboardingChecklist.map((item, index) => (
            <ChecklistItem key={item.task} task={item.task} description="Offboarding procedure checklist item." status={item.status} dueDate={item.dueDate} index={index + 1} />
          ))}
        </Stack>
      </Card>
    </Box>
  )
}

export default Offboarding
