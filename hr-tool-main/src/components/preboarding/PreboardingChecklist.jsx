import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

import ChecklistItem from './ChecklistItem'
import ChecklistDetailDrawer from './ChecklistDetailDrawer'
import ScheduleNotificationDialog from './ScheduleNotificationDialog'
import EmailTemplatePreview from './EmailTemplatePreview'

import { useEmployeesContext } from '../../context/EmployeesContext'

import {
  saveCustomStakeholderSchedule,
  restoreAutomaticStakeholderSchedule,
  getCalendarDetails,
  saveCalendarDetails,
} from '../../services/api'


/**
 * ============================================================
 * STATUS DISPLAY
 * ============================================================
 *
 * Backend:
 * - pending
 * - scheduled
 * - in progress
 * - completed
 *
 * Frontend:
 * - Pending
 * - Scheduled
 * - In Progress
 * - Completed
 */
function formatStatus(status) {
  const normalized =
    String(status || '')
      .trim()
      .toLowerCase()

  switch (normalized) {
    case 'pending':
      return 'Pending'

    case 'scheduled':
      return 'Scheduled'

    case 'in progress':
      return 'In Progress'

    case 'completed':
      return 'Completed'

    default:
      return 'Pending'
  }
}


/**
 * ============================================================
 * MAP BACKEND TASK TO FRONTEND TASK
 * ============================================================
 */
function mapBackendTask(task) {
  return {
    /**
     * Existing frontend identifier.
     */
    id:
      task.Task_ID,

    /**
     * Display data.
     */
    task:
      task.Title || '',

    description:
      task.Description || '',

    status:
      formatStatus(
        task.Status
      ),

    dueDate:
      task.Scheduled_Date || '',

    scheduledDate:
      task.Scheduled_Date || '',

    scheduledTime:
      task.Scheduled_Time || '',

    completedAt:
      task.Completed_At || null,

    notes:
      task.Notes || '',

    assignedTo:
      task.Assigned_To || '',

    /**
     * Workflow metadata.
     */
    taskOrder:
      Number(
        task.Task_Order || 0
      ),

    taskType:
      task.Task_Type || '',

    actionType:
      String(
        task.Action_Type || ''
      )
        .trim()
        .toLowerCase(),

    templateId:
      task.Template_ID || '',

    scheduleMode:
      task.Schedule_Mode || '',

    /**
     * Calendar metadata.
     */
    calendarTemplateId:
      task.Calendar_Template_ID || '',

    calendarTitle:
      task.Calendar_Title || '',

    calendarDescription:
      task.Calendar_Description || '',

    calendarStartDate:
      task.Calendar_Start_Date || '',

    calendarStartTime:
      task.Calendar_Start_Time || '',

    calendarEndTime:
      task.Calendar_End_Time || '',

    calendarLocation:
      task.Calendar_Location || '',

    calendarInternalAttendees:
      task.Calendar_Internal_Attendees || '',

    calendarEventId:
      task.Calendar_Event_ID || '',

    calendarId:
      task.Calendar_ID || '',

    /**
     * Original backend task.
     */
    rawTask:
      task,
  }
}


/**
 * ============================================================
 * CALENDAR EDIT DIALOG
 * ============================================================
 */
function CalendarEditDialog({
  open,
  task,
  onClose,
  onSaved,
}) {

  const [loading, setLoading] =
    useState(false)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')

  const [form, setForm] =
    useState({
      templateId: '',
      title: '',
      description: '',
      startDate: '',
      startTime: '',
      endTime: '',
      location: '',
      internalAttendees: [],
    })


  /**
   * ==========================================================
   * LOAD EXISTING CALENDAR DETAILS
   * ==========================================================
   */
  useEffect(() => {

    if (
      !open ||
      !task
    ) {
      return
    }

    let cancelled = false


    async function loadCalendarDetails() {

      setLoading(true)
      setError('')


      try {

        const details =
          await getCalendarDetails(
            task.id,
            task.templateId ||
              task.calendarTemplateId ||
              'CAL001',
          )


        if (
          cancelled
        ) {
          return
        }


        setForm({
          templateId:
            details?.templateId ||
            task.templateId ||
            task.calendarTemplateId ||
            'CAL001',

          title:
            details?.title ||
            task.calendarTitle ||
            '',

          description:
            details?.description ||
            task.calendarDescription ||
            '',

          startDate:
            details?.startDate ||
            task.calendarStartDate ||
            '',

          startTime:
            details?.startTime ||
            task.calendarStartTime ||
            '',

          endTime:
            details?.endTime ||
            task.calendarEndTime ||
            '',

          location:
            details?.location ||
            task.calendarLocation ||
            '',

          internalAttendees:
            Array.isArray(
              details?.internalAttendees
            )
              ? details.internalAttendees
              : task.calendarInternalAttendees
                ? String(
                    task.calendarInternalAttendees
                  )
                    .split(',')
                    .map(
                      email =>
                        email.trim()
                    )
                    .filter(Boolean)
                : [],
        })

      } catch (loadError) {

        console.error(
          'Failed to load calendar details:',
          loadError,
        )

        if (
          !cancelled
        ) {

          setError(
            loadError?.message ||
            'Failed to load calendar details.'
          )

        }

      } finally {

        if (
          !cancelled
        ) {
          setLoading(false)
        }

      }

    }


    loadCalendarDetails()


    return () => {
      cancelled = true
    }

  }, [
    open,
    task,
  ])


  /**
   * ==========================================================
   * CHANGE FIELD
   * ==========================================================
   */
  const handleChange =
    (
      field,
      value,
    ) => {

      setForm(
        current => ({
          ...current,

          [field]:
            value,
        })
      )

    }


  /**
   * ==========================================================
   * ATTENDEE INPUT
   * ==========================================================
   *
   * Internally we keep an array.
   *
   * UI uses one comma-separated field.
   */
  const attendeeText =
    form.internalAttendees.join(
      ', '
    )


  const handleAttendeeChange =
    event => {

      const values =
        event.target.value
          .split(',')
          .map(
            email =>
              email.trim()
          )
          .filter(Boolean)


      handleChange(
        'internalAttendees',
        values,
      )

    }


  /**
   * ==========================================================
   * SAVE
   * ==========================================================
   */
  const handleSave =
    async () => {

      if (
        !task
      ) {
        return
      }


      setSaving(true)
      setError('')


      try {

        await saveCalendarDetails(
          task.id,
          {
            ...form,
          },
        )


        if (
          onSaved
        ) {

          await onSaved(
            'Calendar details saved successfully.'
          )

        }

        onClose()

      } catch (saveError) {

        console.error(
          'Failed to save calendar details:',
          saveError,
        )

        setError(
          saveError?.message ||
          'Failed to save calendar details.'
        )

      } finally {

        setSaving(false)

      }

    }


  return (
    <Dialog
      open={
        open
      }
      onClose={
        saving
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="md"
    >

      <DialogTitle>
        Edit Calendar Invite
      </DialogTitle>


      <DialogContent
        dividers
      >

        {loading ? (

          <Box
            sx={{
              display:
                'flex',

              justifyContent:
                'center',

              alignItems:
                'center',

              py:
                8,
            }}
          >
            <CircularProgress />
          </Box>

        ) : (

          <Stack
            spacing={2.5}
          >

            {error && (

              <Box
                sx={{
                  p:
                    1.5,

                  borderRadius:
                    1,

                  backgroundColor:
                    '#FCE8E6',
                }}
              >

                <Typography
                  variant="body2"
                  sx={{
                    color:
                      '#C5221F',
                  }}
                >
                  {error}
                </Typography>

              </Box>

            )}


            <TextField
              label="Calendar Title"
              value={
                form.title
              }
              onChange={
                event =>
                  handleChange(
                    'title',
                    event.target.value
                  )
              }
              fullWidth
              disabled={
                saving
              }
            />


            <TextField
              label="Description"
              value={
                form.description
              }
              onChange={
                event =>
                  handleChange(
                    'description',
                    event.target.value
                  )
              }
              multiline
              minRows={6}
              fullWidth
              disabled={
                saving
              }
            />


            <Stack
              direction={{
                xs:
                  'column',
                sm:
                  'row',
              }}
              spacing={2}
            >

              <TextField
                label="Start Date"
                type="date"
                value={
                  form.startDate
                }
                onChange={
                  event =>
                    handleChange(
                      'startDate',
                      event.target.value
                    )
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                disabled={
                  saving
                }
              />


              <TextField
                label="Start Time"
                type="time"
                value={
                  form.startTime
                }
                onChange={
                  event =>
                    handleChange(
                      'startTime',
                      event.target.value
                    )
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                disabled={
                  saving
                }
              />


              <TextField
                label="End Time"
                type="time"
                value={
                  form.endTime
                }
                onChange={
                  event =>
                    handleChange(
                      'endTime',
                      event.target.value
                    )
                }
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                disabled={
                  saving
                }
              />

            </Stack>


            <TextField
              label="Location"
              value={
                form.location
              }
              onChange={
                event =>
                  handleChange(
                    'location',
                    event.target.value
                  )
              }
              fullWidth
              disabled={
                saving
              }
            />


            <TextField
              label="Internal Attendees"
              value={
                attendeeText
              }
              onChange={
                handleAttendeeChange
              }
              helperText="Enter internal attendees separated by commas. Example: HR_TEAM, REPORTING_MANAGER"
              fullWidth
              disabled={
                saving
              }
            />


            <Box
              sx={{
                p:
                  1.5,

                borderRadius:
                  1,

                backgroundColor:
                  '#F8F9FA',
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',
                }}
              >
                Candidate email is taken automatically from the employee's Personal_Email and cannot be changed here.
              </Typography>

            </Box>


            <Divider />


            <Typography
              variant="caption"
              sx={{
                color:
                  '#5F6368',
              }}
            >
              Template ID: {form.templateId || 'CAL001'}
            </Typography>

          </Stack>

        )}

      </DialogContent>


      <DialogActions
        sx={{
          px:
            3,

          py:
            2,
        }}
      >

        <Button
          onClick={
            onClose
          }
          disabled={
            saving
          }
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          onClick={
            handleSave
          }
          disabled={
            loading ||
            saving
          }
          startIcon={
            saving ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : null
          }
        >
          {saving
            ? 'Saving...'
            : 'Save Calendar'}
        </Button>

      </DialogActions>

    </Dialog>
  )
}


/**
 * ============================================================
 * PREBOARDING CHECKLIST
 * ============================================================
 */
function PreboardingChecklist({
  candidate,
}) {

  const {
    refreshEmployees,
  } =
    useEmployeesContext()


  const [
    selectedTaskId,
    setSelectedTaskId,
  ] =
    useState(null)


  const [
    scheduleOpen,
    setScheduleOpen,
  ] =
    useState(false)


  const [
    templateOpen,
    setTemplateOpen,
  ] =
    useState(false)


  const [
    templateTask,
    setTemplateTask,
  ] =
    useState(null)


  const [
    calendarEditOpen,
    setCalendarEditOpen,
  ] =
    useState(false)


  const [
    calendarEditTask,
    setCalendarEditTask,
  ] =
    useState(null)


  const [
    toastOpen,
    setToastOpen,
  ] =
    useState(false)


  const [
    toastMessage,
    setToastMessage,
  ] =
    useState('')


  /**
   * ==========================================================
   * REAL BACKEND TASKS
   * ==========================================================
   */
  const items =
    useMemo(() => {

      if (
        !candidate ||
        !Array.isArray(
          candidate.preboardingTasks
        )
      ) {
        return []
      }


      return candidate
        .preboardingTasks
        .map(
          mapBackendTask
        )
        .sort(
          (a, b) =>
            a.taskOrder -
            b.taskOrder
        )

    }, [
      candidate,
    ])


  /**
   * ==========================================================
   * EMPLOYEE TYPE
   * ==========================================================
   */
  const isFullTime =
    candidate?.employmentType ===
    'Full Time'


  const isSenior =
    isFullTime &&
    candidate?.seniorPosition ===
      true


  /**
   * ==========================================================
   * VISIBLE TASKS
   * ==========================================================
   */
  const visibleItems =
    useMemo(() => {

      return items.filter(
        item => {

          if (
            item.taskType ===
            'director-email'
          ) {
            return isSenior
          }

          return true

        }
      )

    }, [
      items,
      isSenior,
    ])


  /**
   * ==========================================================
   * SELECTED TASK
   * ==========================================================
   */
  const selectedItem =
    useMemo(() => {

      return (
        visibleItems.find(
          item =>
            item.id ===
            selectedTaskId
        ) || null
      )

    }, [
      visibleItems,
      selectedTaskId,
    ])


  /**
   * ==========================================================
   * PROGRESS
   * ==========================================================
   */
  const completedCount =
    visibleItems.filter(
      item =>
        item.status ===
        'Completed'
    ).length


  const percentage =
    visibleItems.length
      ? Math.round(
          (
            completedCount /
            visibleItems.length
          ) * 100
        )
      : 0


  /**
   * ==========================================================
   * VIEW TEMPLATE
   * ==========================================================
   */
  const handleViewTemplate =
    item => {

      if (!item) {
        return
      }


      if (
        item.actionType !==
          'email' &&
        item.actionType !==
          'calendar'
      ) {
        return
      }


      setTemplateTask(
        item
      )


      setTemplateOpen(
        true
      )

    }


  /**
   * ==========================================================
   * CALENDAR EDIT
   * ==========================================================
   */
  const handleOpenCalendarEdit =
    item => {

      if (
        !item ||
        item.actionType !==
          'calendar'
      ) {
        return
      }


      if (
        item.status ===
        'Completed'
      ) {

        setToastMessage(
          'A completed Calendar Invite cannot be edited.'
        )

        setToastOpen(
          true
        )

        return
      }


      setCalendarEditTask(
        item
      )


      setCalendarEditOpen(
        true
      )

    }


  /**
   * ==========================================================
   * CALENDAR SAVED
   * ==========================================================
   */
  const handleCalendarSaved =
    async message => {

      try {

        await refreshEmployees()


        setToastMessage(
          message ||
          'Calendar details saved.'
        )

        setToastOpen(
          true
        )

        setCalendarEditOpen(
          false
        )

        setCalendarEditTask(
          null
        )

      } catch (error) {

        console.error(
          'Failed to refresh after calendar update:',
          error,
        )

        setToastMessage(
          error?.message ||
          'Calendar was saved, but refresh failed.'
        )

        setToastOpen(
          true
        )

      }

    }


  /**
   * ==========================================================
   * STAKEHOLDER SCHEDULE
   * ==========================================================
   */
  const handleScheduleSave = async (values) => {
    if (!candidate) {
      return
    }

    const stakeholderTask = items.find(
      (item) =>
        item.taskType === 'stakeholder-notification'
    )

    if (!stakeholderTask) {
      setToastMessage(
        'Stakeholder Notification task was not found.'
      )
      setToastOpen(true)
      return
    }

    console.log(
      'STAKEHOLDER SCHEDULE SAVE:',
      {
        taskId: stakeholderTask.id,
        scheduleMode: values.scheduleMode,
        scheduledDate: values.scheduledDate,
        scheduledTime: values.scheduledTime,
      }
    )

    try {
      let result

      if (values.scheduleMode === 'custom') {
        result = await saveCustomStakeholderSchedule(
          stakeholderTask.id,
          values.scheduledDate,
          values.scheduledTime,
        )
      } else if (values.scheduleMode === 'automatic') {
        result = await restoreAutomaticStakeholderSchedule(
          stakeholderTask.id,
        )
      } else {
        throw new Error(
          `Invalid schedule mode: ${values.scheduleMode}`
        )
      }

      console.log(
        'STAKEHOLDER SCHEDULE SAVED:',
        result
      )

      await refreshEmployees()

      setToastMessage(
        'Stakeholder notification schedule updated.'
      )
      setToastOpen(true)
      setScheduleOpen(false)
    } catch (error) {
      console.error(
        'STAKEHOLDER SCHEDULE SAVE FAILED:',
        error
      )

      setToastMessage(
        error?.message ||
        'Failed to update stakeholder schedule.'
      )
      setToastOpen(true)
    }
  }


  /**
   * ==========================================================
   * AFTER TASK CHANGE
   * ==========================================================
   */
  const handleTaskChanged =
    async message => {

      try {

        await refreshEmployees()


        if (message) {

          setToastMessage(
            message
          )

          setToastOpen(
            true
          )

        }


        setSelectedTaskId(
          null
        )

      } catch (error) {

        console.error(
          'Failed to refresh employee data:',
          error,
        )

        setToastMessage(
          error?.message ||
          'Task was updated, but refresh failed.'
        )

        setToastOpen(
          true
        )

      }

    }


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */
  return (
    <Stack
      spacing={
        2.5
      }
    >

      {/* ======================================================
          HEADER / PROGRESS
          ====================================================== */}
      <Card
        sx={{
          p:
            2.5,

          border:
            '1px solid #DADCE0',
        }}
      >

        <Stack
          direction={{
            xs:
              'column',
            md:
              'row',
          }}

          spacing={
            2
          }

          sx={{
            justifyContent:
              'space-between',

            alignItems: {
              xs:
                'flex-start',
              md:
                'center',
            },
          }}
        >

          <Box>

            <Typography
              variant="h6"
            >
              Preboarding Checklist
            </Typography>


            {candidate && (

              <Typography
                variant="body2"
                sx={{
                  color:
                    '#5F6368',

                  mt:
                    0.4,
                }}
              >
                {candidate.firstName}{' '}
                {candidate.lastName}
              </Typography>

            )}

          </Box>


          <Button
            variant="outlined"
            size="small"
            onClick={() =>
              setScheduleOpen(
                true
              )
            }
          >
            Customize Schedule
          </Button>

        </Stack>


        <Stack
          direction="row"

          sx={{
            justifyContent:
              'space-between',

            alignItems:
              'center',

            mt:
              2,
          }}
        >

          <Typography
            variant="h6"
            sx={{
              fontWeight:
                700,
            }}
          >
            {percentage}%
          </Typography>


          <Typography
            variant="caption"
            sx={{
              color:
                '#5F6368',
            }}
          >
            {completedCount} of{' '}
            {visibleItems.length}{' '}
            tasks completed
          </Typography>

        </Stack>


        <Box
          sx={{
            mt:
              1,

            height:
              8,

            borderRadius:
              999,

            backgroundColor:
              '#E8EAED',

            overflow:
              'hidden',
          }}
        >

          <Box
            sx={{
              width:
                `${percentage}%`,

              height:
                '100%',

              backgroundColor:
                '#1A73E8',

              borderRadius:
                999,
            }}
          />

        </Box>

      </Card>


      {/* ======================================================
          TASK LIST
          ====================================================== */}
      <Card
        sx={{
          p:
            2,

          border:
            '1px solid #DADCE0',
        }}
      >

        <Stack
          spacing={
            1.5
          }
        >

          {visibleItems.length ===
          0 ? (

            <Typography
              variant="body2"
              sx={{
                color:
                  '#5F6368',

                p:
                  2,
              }}
            >
              No preboarding tasks found.
            </Typography>

          ) : (

            visibleItems.map(
              item => (

                <ChecklistItem

                  key={
                    item.id
                  }

                  task={
                    item.task
                  }

                  description={
                    item.description
                  }

                  status={
                    item.status
                  }

                  dueDate={
                    item.dueDate
                  }

                  scheduledDate={
                    item.scheduledDate
                  }

                  completedAt={
                    item.completedAt
                  }

                  onClick={() =>
                    setSelectedTaskId(
                      item.id
                    )
                  }

                />

              )
            )

          )}

        </Stack>

      </Card>


      {/* ======================================================
          INTERN DOCUMENT INFORMATION
          ====================================================== */}
      {candidate &&
        candidate.employmentType ===
          'Intern' && (

        <Card
          sx={{
            p:
              2,

            border:
              '1px solid #DADCE0',

            backgroundColor:
              '#F8F9FA',
          }}
        >

          <Typography
            variant="body2"
            sx={{
              color:
                '#5F6368',
            }}
          >
            Required documents are included in the offer letter.
          </Typography>

        </Card>

      )}


      {/* ======================================================
          FULL-TIME DOCUMENT INFORMATION
          ====================================================== */}
      {candidate &&
        candidate.employmentType ===
          'Full Time' && (

        <Card
          sx={{
            p:
              2,

            border:
              '1px solid #DADCE0',

            backgroundColor:
              '#F8F9FA',
          }}
        >

          <Typography
            variant="body2"
            sx={{
              color:
                '#5F6368',
            }}
          >
            Required documents will be collected during the documentation process.
          </Typography>

        </Card>

      )}


      {/* ======================================================
          TASK DETAILS
          ====================================================== */}
      {selectedItem && (

        <ChecklistDetailDrawer

          open={
            Boolean(
              selectedItem
            )
          }

          item={
            selectedItem
          }

          employee={
            candidate
          }

          onClose={() =>
            setSelectedTaskId(
              null
            )
          }

          onViewTemplate={() =>
            handleViewTemplate(
              selectedItem
            )
          }

          onTaskChanged={
            handleTaskChanged
          }

          onOpenCalendarEdit={() =>
            handleOpenCalendarEdit(
              selectedItem
            )
          }

        />

      )}


      {/* ======================================================
          STAKEHOLDER SCHEDULE
          ====================================================== */}
      <ScheduleNotificationDialog

        open={
          scheduleOpen
        }

        onClose={() =>
          setScheduleOpen(
            false
          )
        }

        onSave={
          handleScheduleSave
        }

        taskId={
          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.id || ''
        }

        initialDate={

          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.scheduledDate ||

          ''

        }

        initialTime={

          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.scheduledTime ||

          '09:00'

        }

        initialMode={

          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.scheduleMode ===
            'custom'
            ? 'custom'
            : 'automatic'

        }

        automaticScheduledDate={

          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.scheduledDate ||

          ''

        }

        automaticScheduledTime={

          items.find(
            item =>
              item.taskType ===
              'stakeholder-notification'
          )?.scheduledTime ||

          '09:00'

        }

      />


      {/* ======================================================
          EMAIL / CALENDAR TEMPLATE PREVIEW
          ====================================================== */}
      <EmailTemplatePreview

        open={
          templateOpen
        }

        onClose={() =>
          setTemplateOpen(
            false
          )
        }

        task={
          templateTask
        }

        employee={
          candidate
        }

      />


      {/* ======================================================
          CALENDAR EDITOR
          ====================================================== */}
      <CalendarEditDialog

        open={
          calendarEditOpen
        }

        task={
          calendarEditTask
        }

        onClose={() => {

          setCalendarEditOpen(
            false
          )

          setCalendarEditTask(
            null
          )

        }}

        onSaved={
          handleCalendarSaved
        }

      />


      {/* ======================================================
          TOAST
          ====================================================== */}
      <Snackbar

        open={
          toastOpen
        }

        autoHideDuration={
          2500
        }

        onClose={() =>
          setToastOpen(
            false
          )
        }

        message={
          toastMessage
        }

        anchorOrigin={{
          vertical:
            'bottom',

          horizontal:
            'center',
        }}

      />

    </Stack>
  )
}


export default PreboardingChecklist