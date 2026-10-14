import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import ProgressBar from '../common/ProgressBar'
import ChecklistItem from './ChecklistItem'

function Checklist({ title, items, subtitle }) {
  const [selectedItem, setSelectedItem] = useState(null)

  const completedCount = useMemo(
    () => items.filter((item) => item.status === 'Completed').length,
    [items],
  )
  const percentage = items.length ? Math.round((completedCount / items.length) * 100) : 0

  const markComplete = () => {
    if (!selectedItem) return

    const updatedItem = { ...selectedItem, status: 'Completed' }
    setSelectedItem(updatedItem)
  }

  return (
    <Stack spacing={2.5}>
      <Stack spacing={1.5}>
        <Typography variant="h6">{title}</Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: '#5F6368' }}>{subtitle}</Typography>
        )}
        <ProgressBar value={percentage} label={`${completedCount} of ${items.length} tasks completed`} showLabel />
      </Stack>

      <Stack spacing={1.25}>
        {items.map((item, index) => (
          <ChecklistItem
            key={item.task}
            task={item.task}
            description={item.description}
            status={item.status}
            dueDate={item.dueDate}
            index={index + 1}
            onSelect={() => setSelectedItem(item)}
          />
        ))}
      </Stack>

      <Dialog open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedItem?.task}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: '#5F6368' }}>{selectedItem?.description}</Typography>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Typography variant="body2"><strong>Status:</strong> {selectedItem?.status}</Typography>
              <Typography variant="body2"><strong>Due Date:</strong> {selectedItem?.dueDate}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: '#5F6368' }}>
              Notes: Follow up with the relevant owner and confirm all required setup is complete before the scheduled due date.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedItem(null)}>Close</Button>
          <Button variant="contained" onClick={() => {
            setSelectedItem(null)
            markComplete()
          }}>
            Mark Complete
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}

export default Checklist
