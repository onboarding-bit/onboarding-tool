import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { stakeholderRecipients } from '../../data/stakeholderRecipients'

function ScheduleNotificationDialog({
  open,
  onClose,
  onSave,
  initialDate = '2026-08-15',
  initialTime = '09:00',
  initialMode = 'automatic',
  automaticScheduledDate = '',
  automaticScheduledTime = '',
}) {
  function normalizeDateValue(value) {
    if (!value) return ''

    const text = String(value).trim()

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text
    }

    if (text.includes('T')) {
      return text.slice(0, 10)
    }

    return ''
  }

  function normalizeTimeValue(value) {
    if (!value) return ''

    const text = String(value).trim()
    const match = text.match(/(?:T|\s)(\d{1,2}):(\d{2})/)

    if (match) {
      return `${String(match[1]).padStart(2, '0')}:${match[2]}`
    }

    if (/^\d{1,2}:\d{2}$/.test(text)) {
      const [hour, minute] = text.split(':')
      return `${String(hour).padStart(2, '0')}:${minute}`
    }

    return ''
  }

  const recipientsString = [
    ...stakeholderRecipients.internalHR.map((r) => r.name),
    ...stakeholderRecipients.itSupport.map((r) => r.name),
  ].join(', ')

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      scheduledDate: normalizeDateValue(initialDate),
      scheduledTime: normalizeTimeValue(initialTime),
      recipients: recipientsString,
      messageTemplate: 'Stakeholder update for upcoming joiner',
    },
  })

  const [currentScheduleMode, setCurrentScheduleMode] = useState(initialMode === 'custom' ? 'custom' : 'automatic')
  const [savedScheduleMode, setSavedScheduleMode] = useState(initialMode === 'custom' ? 'custom' : 'automatic')
  const [currentScheduledDate, setCurrentScheduledDate] = useState('')
  const [savedScheduledDate, setSavedScheduledDate] = useState('')
  const [currentScheduledTime, setCurrentScheduledTime] = useState('')
  const [savedScheduledTime, setSavedScheduledTime] = useState('')

  const existingScheduledDate = automaticScheduledDate || initialDate
  const existingScheduledTime = automaticScheduledTime || initialTime

  useEffect(() => {
    const mode = initialMode === 'custom' ? 'custom' : 'automatic'
    const normalizedDate = normalizeDateValue(existingScheduledDate)
    const normalizedTime = normalizeTimeValue(existingScheduledTime)

    setCurrentScheduleMode(mode)
    setSavedScheduleMode(mode)
    setCurrentScheduledDate(normalizedDate)
    setSavedScheduledDate(normalizedDate)
    setCurrentScheduledTime(normalizedTime)
    setSavedScheduledTime(normalizedTime)
    reset({
      scheduledDate: normalizedDate,
      scheduledTime: normalizedTime,
      recipients: recipientsString,
      messageTemplate: 'Stakeholder update for upcoming joiner',
    })
  }, [open, existingScheduledDate, existingScheduledTime, initialMode, reset, recipientsString])

  const scheduledDateValue = watch('scheduledDate')
  const scheduledTimeValue = watch('scheduledTime')

  const handleModeChange = (event) => {
    const mode = event.target.value
    setCurrentScheduleMode(mode)

    if (mode === 'custom') {
      const date = currentScheduledDate || normalizeDateValue(existingScheduledDate)
      const time = currentScheduledTime || normalizeTimeValue(existingScheduledTime)
      setCurrentScheduledDate(date)
      setCurrentScheduledTime(time)
      setValue('scheduledDate', date)
      setValue('scheduledTime', time)
    }
  }

  const handleSave = async (values) => {
    const scheduledDate = normalizeDateValue(currentScheduleMode === 'custom' ? values.scheduledDate : currentScheduledDate)
    const scheduledTime = normalizeTimeValue(currentScheduleMode === 'custom' ? values.scheduledTime : currentScheduledTime)
    const payload = {
      scheduleMode: currentScheduleMode,
      scheduledDate,
      scheduledTime,
      recipients: values.recipients,
      messageTemplate: values.messageTemplate,
    }

    console.log(
      'Schedule dialog submitting:',
      payload
    )

    await onSave(payload)
  }

  const saveDisabled = currentScheduleMode === savedScheduleMode &&
    currentScheduledDate === savedScheduledDate &&
    currentScheduledTime === savedScheduledTime

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Customize Schedule</DialogTitle>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <FormControl>
              <RadioGroup
                row
                value={currentScheduleMode}
                onChange={handleModeChange}
              >
                <FormControlLabel value="automatic" control={<Radio />} label="Automatic" />
                <FormControlLabel value="custom" control={<Radio />} label="Custom" />
              </RadioGroup>
            </FormControl>

            {currentScheduleMode === 'automatic' ? (
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>Joining Date - 3 days</Typography>
                <Typography variant="body2" sx={{ color: '#5F6368' }}>
                  Current automatic schedule: {normalizeDateValue(existingScheduledDate) || '—'} at {normalizeTimeValue(existingScheduledTime) || '09:00'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#5F6368' }}>
                  The stakeholder notification date is calculated from the joining date and cannot be edited in automatic mode.
                </Typography>
              </Stack>
            ) : (
              <>
                <TextField
                  type="date"
                  label="Notification Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputBase-root': { minHeight: 56 } }}
                  value={currentScheduledDate || scheduledDateValue || ''}
                  {...register('scheduledDate')}
                  onChange={(event) => {
                    const value = normalizeDateValue(event.target.value)
                    setCurrentScheduledDate(value)
                    setValue('scheduledDate', value, { shouldDirty: true })
                  }}
                  disabled={currentScheduleMode !== 'custom'}
                />
                <TextField
                  type="time"
                  label="Notification Time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiInputBase-root': { minHeight: 56 } }}
                  value={currentScheduledTime || scheduledTimeValue || ''}
                  {...register('scheduledTime')}
                  onChange={(event) => {
                    const value = normalizeTimeValue(event.target.value)
                    setCurrentScheduledTime(value)
                    setValue('scheduledTime', value, { shouldDirty: true })
                  }}
                  disabled={currentScheduleMode !== 'custom'}
                />
              </>
            )}

            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Recipients</Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                <strong>Internal HR Team</strong>
                <br />
                {stakeholderRecipients.internalHR.map((r) => (
                  <span key={r.email}>• {r.name}<br /></span>
                ))}
                <br />
                <strong>IT Support</strong>
                <br />
                {stakeholderRecipients.itSupport.map((r) => (
                  <span key={r.email}>• {r.name}<br /></span>
                ))}
              </Typography>
            </Stack>
            <input type="hidden" value={recipientsString} {...register('recipients')} />
            <TextField label="Message Template" multiline minRows={3} {...register('messageTemplate')} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={saveDisabled}>Save Schedule</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ScheduleNotificationDialog
