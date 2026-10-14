import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, IconButton, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import { useEmployeesContext } from '../../context/EmployeesContext'
import { getEmployeeDisplayName, splitFullName } from '../../utils/nameUtils'
import { reconcilePreboardingChecklist, getChecklistProgress } from '../../utils/lifecycleUtils'
import { formatDateISO, formatDateDisplay } from '../../utils/dateUtils'

function AddCandidateDialog({ open, onClose, onSubmitCandidate, employee = null, onSave }) {
  const { employees, updateEmployee, addEmployee, updateEmployeeChecklist, updateEmployeeWithChecklist } = useEmployeesContext()

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch, setError } = useForm({
    defaultValues: {
      employeeId: '',
      firstName: '',
      lastName: '',
      personalEmail: '',
      workEmail: '',
      phoneNumber: '',
      designation: '',
      department: 'Engineering',
      employmentType: 'Full Time',
      joiningDate: '',
      reportingManager: '',
      workLocation: '',
      seniorPosition: 'No',
      immediateJoining: 'No',
    },
  })

  useEffect(() => {
    if (!open) {
      reset()
      return
    }

    // If editing, prefill with employee data
    if (employee) {
      const { firstName, lastName } = employee.firstName || employee.lastName ? { firstName: employee.firstName || '', lastName: employee.lastName || '' } : splitFullName(employee.name || '')
      reset({
        employeeId: employee.employeeId || '',
        firstName: firstName,
        lastName: lastName,
        personalEmail: employee.personalEmail || employee.email || '',
        workEmail: employee.workEmail || '',
        phoneNumber: employee.phone || '',
        designation: employee.designation || '',
        department: employee.department || 'Engineering',
        employmentType: employee.employmentType || 'Full Time',
        joiningDate: formatDateISO(employee.joiningDate) || '',
        reportingManager: employee.reportingManager || employee.Reporting_Manager || '',
        workLocation: employee.location || employee.workLocation || '',
        seniorPosition: employee.seniorPosition ? 'Yes' : 'No',
        immediateJoining: employee.immediateJoining ? 'Yes' : 'No',
      })
    }
  }, [open, reset])

  const commonFieldSx = {
    '& .MuiOutlinedInput-root': {
      height: 56,
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#DADCE0', borderWidth: '1px' },
      '&:hover fieldset': { borderColor: '#BDC1C6' },
      '&.Mui-focused fieldset': { borderColor: '#1A73E8', borderWidth: '2px' },
      '& .MuiOutlinedInput-input': { padding: '16px 14px', color: '#202124', fontSize: 16, minHeight: 'auto' },
      '& .MuiSelect-select': { padding: '16px 14px', display: 'flex', alignItems: 'center' },
      '& input': { padding: '16px 14px', color: '#202124', fontSize: 16 },
    },
  }

  const labelStyles = {
    color: '#5F6368',
    fontSize: 16,
    fontWeight: 400,
    lineHeight: '23px',
    bgcolor: 'transparent',
    px: 0,
    '&.Mui-focused': { color: '#1A73E8' },
  }

  const joiningDateValue = watch('joiningDate')
  const immediateJoining = watch('immediateJoining')
  const isJoiningInPast = (() => {
    if (!joiningDateValue) return false
    const sel = new Date(joiningDateValue)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return sel < today
  })()

  const onSubmit = async (values) => {
    // Add mode vs Edit mode
    if (employee) {
      const stableId = employee.id
      const newEmployeeId = values.employeeId?.trim()

      // check uniqueness against employeeId field
      if (newEmployeeId && employees.some((e) => e.employeeId === newEmployeeId && e.id !== stableId)) {
        setError('employeeId', { type: 'manual', message: 'Employee ID already exists.' })
        return
      }

      try {
        const updatedFields = {
          Employee_ID:
            String(newEmployeeId || employee.employeeId || '').trim(),

          First_Name:
            String(values.firstName || '').trim(),

          Last_Name:
            String(values.lastName || '').trim(),

          Personal_Email:
            String(values.personalEmail || '').trim(),

          Work_Email:
            String(values.workEmail || '').trim(),

          Phone:
            String(values.phoneNumber || '').trim(),

          Designation:
            String(values.designation || '').trim(),

          Department:
            String(values.department || '').trim(),

          Employment_Type:
            String(values.employmentType || '').trim(),

          Joining_Date:
            String(values.joiningDate || '').trim(),

          Reporting_Manager:
            String(values.reportingManager || '').trim(),

          Work_Location:
            String(values.workLocation || '').trim(),

          Senior_Position:
            values.seniorPosition === 'Yes',

          Immediate_Joining:
            values.immediateJoining === 'Yes',
        }

        await updateEmployee(stableId, updatedFields)

        if (onSave) {
          await onSave()
        }

        onClose()
        return
      } catch (error) {
        const message = error?.message || 'Failed to update employee.'
        setError('employeeId', { type: 'manual', message })
        throw error
      }
    }

    const newEmployeeId = values.employeeId?.trim()
    if (!newEmployeeId) {
      setError('employeeId', { type: 'manual', message: 'Employee ID is required.' })
      return
    }
    if (employees.some((e) => e.employeeId === newEmployeeId)) {
      setError('employeeId', { type: 'manual', message: 'Employee ID already exists.' })
      return
    }

    const employeeData = {
      Employee_ID: newEmployeeId,
      First_Name: values.firstName?.trim() || '',
      Last_Name: values.lastName?.trim() || '',
      Personal_Email: values.personalEmail?.trim() || '',
      Work_Email: values.workEmail?.trim() || '',
      Phone: values.phoneNumber?.trim() || '',
      Designation: values.designation?.trim() || '',
      Department: values.department,
      Employment_Type: values.employmentType,
      Joining_Date: values.joiningDate,
      Reporting_Manager: values.reportingManager?.trim() || '',
      Work_Location: values.workLocation?.trim() || '',
      Senior_Position: values.seniorPosition === 'Yes',
      Immediate_Joining: values.immediateJoining === 'Yes',
    }

    await addEmployee(employeeData)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { width: 780, maxWidth: 'calc(100% - 48px)' } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Box>
          <Typography variant="h6">{employee ? 'Edit Employee' : 'Add Candidate'}</Typography>
          <Typography variant="body2" sx={{ color: '#5F6368' }}>{employee ? 'Update employee details.' : 'Create a preboarding record for a new employee.'}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ maxHeight: '60vh', overflow: 'auto' }}>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Personal Information</Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="First Name"
                  {...register('firstName', { required: 'First name is required' })}
                  error={Boolean(errors.firstName)}
                  helperText={errors.firstName?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  {...register('lastName', { required: 'Last name is required' })}
                  error={Boolean(errors.lastName)}
                  helperText={errors.lastName?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Personal Email"
                  {...register('personalEmail', {
                    required: 'Personal email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  error={Boolean(errors.personalEmail)}
                  helperText={errors.personalEmail?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register('phoneNumber', { required: 'Phone number is required' })}
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Employment Information</Typography>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  {...register('employeeId', { required: 'Employee ID is required' })}
                  error={Boolean(errors.employeeId)}
                  helperText={errors.employeeId?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
                <TextField
                  fullWidth
                  label="Employee Mail ID"
                  {...register('workEmail')}
                  error={Boolean(errors.workEmail)}
                  helperText={errors.workEmail?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Designation"
                  {...register('designation', { required: 'Designation is required' })}
                  error={Boolean(errors.designation)}
                  helperText={errors.designation?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
                <TextField
                  fullWidth
                  select
                  label="Department"
                  defaultValue="Engineering"
                  {...register('department', { required: 'Department is required' })}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                >
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Analytics">Analytics</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </TextField>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="Employment Type"
                  defaultValue="Full Time"
                  {...register('employmentType', { required: 'Employment type is required' })}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                >
                  <MenuItem value="Full Time">Full Time</MenuItem>
                  <MenuItem value="Intern">Intern</MenuItem>
                </TextField>
                <FormControl fullWidth variant="outlined" error={Boolean(errors.joiningDate)}>
                  <InputLabel
                    shrink
                    htmlFor="joining-date"
                    sx={{
                      ...labelStyles,
                      backgroundColor: '#FFFFFF',
                      paddingLeft: '4px',
                      paddingRight: '4px',
                      zIndex: 1,
                    }}
                  >
                    Joining Date
                  </InputLabel>
                  <OutlinedInput
                    id="joining-date"
                    label="Joining Date"
                    type="date"
                    {...register('joiningDate', { required: 'Joining date is required' })}
                    sx={{
                      height: 56,
                      backgroundColor: '#FFFFFF',
                      '& input': { padding: '16px 14px', color: '#202124', fontSize: 16, lineHeight: '24px' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DADCE0', borderWidth: '1px' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#BDC1C6' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1A73E8', borderWidth: '2px' },
                    }}
                  />
                  {errors.joiningDate && (
                    <FormHelperText>{errors.joiningDate?.message}</FormHelperText>
                  )}
                </FormControl>
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Reporting Manager"
                  {...register('reportingManager', { required: 'Reporting manager is required' })}
                  error={Boolean(errors.reportingManager)}
                  helperText={errors.reportingManager?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
                <TextField
                  fullWidth
                  label="Work Location"
                  {...register('workLocation', { required: 'Work location is required' })}
                  error={Boolean(errors.workLocation)}
                  helperText={errors.workLocation?.message}
                  sx={commonFieldSx}
                  InputLabelProps={{ sx: labelStyles }}
                />
              </Stack>
            </Stack>

            <Stack spacing={1}>
              <FormLabel sx={{ fontWeight: 600 }}>Senior Position?</FormLabel>
              <FormControl>
                <RadioGroup row defaultValue="No" {...register('seniorPosition')}>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Stack>

            <Stack spacing={1}>
              <FormLabel sx={{ fontWeight: 600 }}>Immediate Joining?</FormLabel>
              <FormControl>
                <RadioGroup row defaultValue="No" {...register('immediateJoining')}>
                  <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                  <FormControlLabel value="No" control={<Radio />} label="No" />
                </RadioGroup>
                {immediateJoining === 'Yes' && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Immediate joining selected. The default 3-day stakeholder notification rule can be customized after the candidate is created.
                  </Alert>
                )}
              </FormControl>
            </Stack>

            {isJoiningInPast && (
              <FormHelperText error sx={{ mt: 1 }}>Selected joining date is in the past.</FormHelperText>
            )}
          </Stack>
        </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #F1F3F4' }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ backgroundColor: '#1A73E8', '&:hover': { backgroundColor: '#1669c7' } }}>
            {employee ? 'Save Changes' : 'Add Candidate'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddCandidateDialog