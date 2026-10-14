import { Close, Edit, TaskAlt } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material'

import { formatDateDisplay } from '../../utils/dateUtils'

import {
  completeManualPreboardingTask,
  processUserEmailCreationRequest,
  processWelcomeAboardEmail,
  processDirectorEmail,
  createWorkspaceUserFromTask,
  createCalendarInvite,
  saveCalendarDetails,
  updatePreboardingTask,
} from '../../services/api'

import {
  statusConfig as centralizedStatusConfig,
} from '../common/StatusChip'


/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function normalizeStatus(status) {
  return String(status || '')
    .trim()
    .toLowerCase()
}


function isEmailTask(item) {
  return (
    String(item?.actionType || '')
      .trim()
      .toLowerCase() === 'email'
  )
}


function isCalendarTask(item) {
  return (
    String(item?.actionType || '')
      .trim()
      .toLowerCase() === 'calendar'
  )
}


function isWorkspaceTask(item) {
  return (
    String(item?.actionType || '')
      .trim()
      .toLowerCase() === 'workspace'
  )
}


function isManualTask(item) {
  return (
    String(item?.actionType || '')
      .trim()
      .toLowerCase() === 'manual'
  )
}


function isSystemTask(item) {
  return (
    String(item?.actionType || '')
      .trim()
      .toLowerCase() === 'system'
  )
}


function hasTemplate(item) {
  return (
    isEmailTask(item) ||
    isCalendarTask(item)
  )
}


function getActionLabel(item) {
  const actionType =
    String(item?.actionType || '')
      .trim()
      .toLowerCase()

  switch (actionType) {
    case 'email':
      return 'Email'

    case 'calendar':
      return 'Calendar'

    case 'workspace':
      return 'Workspace'

    case 'manual':
      return 'Manual'

    case 'system':
      return 'System'

    default:
      return ''
  }
}


function formatTime12(time) {
  if (!time) {
    return ''
  }

  const parts =
    String(time)
      .trim()
      .split(':')

  if (parts.length !== 2) {
    return time
  }

  let hour =
    Number(parts[0])

  const minute =
    parts[1]

  if (
    Number.isNaN(hour)
  ) {
    return time
  }

  const suffix =
    hour >= 12
      ? 'PM'
      : 'AM'

  if (hour === 0) {
    hour = 12
  } else if (
    hour > 12
  ) {
    hour -= 12
  }

  return `${String(hour).padStart(2, '0')}:${minute} ${suffix}`
}


/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */
function ChecklistDetailDrawer({
  open,
  item,
  employee,
  onClose,
  onViewTemplate,
  onTaskChanged,
  onOpenCalendarEdit,
}) {

  const [notes, setNotes] =
    useState(
      item?.notes || ''
    )

  const [assignedTo, setAssignedTo] =
    useState(
      item?.assignedTo || ''
    )

  const [saving, setSaving] =
    useState(false)

  const [actionError, setActionError] =
    useState('')


  /**
   * Reset local fields whenever selected task changes.
   */
  useEffect(() => {

    setNotes(
      item?.notes || ''
    )

    setAssignedTo(
      item?.assignedTo || ''
    )

    setActionError('')

  }, [
    item,
  ])


  /**
   * ==========================================================
   * STATUS
   * ==========================================================
   */
  const status =
    item?.status || 'Pending'

  const normalizedStatus =
    normalizeStatus(
      status
    )


  /**
   * ==========================================================
   * TASK FLAGS
   * ==========================================================
   */
  const candidateAcceptance =
    item?.taskType ===
    'candidate-acceptance'

  const templateAvailable =
    hasTemplate(
      item
    )

  const calendarTask =
    isCalendarTask(
      item
    )

  const emailTask =
    isEmailTask(
      item
    )

  const workspaceTask =
    isWorkspaceTask(
      item
    )

  const manualTask =
    isManualTask(
      item
    )

  const systemTask =
    isSystemTask(
      item
    )


  /**
   * Candidate acceptance is locked.
   */
  const canEditTask =
    Boolean(
      item
    ) &&
    !candidateAcceptance


  /**
   * Only scheduled / in-progress actions
   * should be executable.
   */
  const canStart =
    normalizedStatus ===
      'scheduled' ||
    normalizedStatus ===
      'in progress'


  /**
   * ==========================================================
   * STATUS STYLE
   * ==========================================================
   */
  const statusStyles =
    useMemo(
      () =>
        centralizedStatusConfig[
          status
        ] || {
          backgroundColor:
            '#F1F1F1',

          color:
            '#5F6368',
        },
      [
        status,
      ],
    )


  /**
   * ==========================================================
   * PROCESS AUTOMATED TASK
   * ==========================================================
   */
  async function handleProcessTask() {

    if (!item) {
      return
    }

    setSaving(
      true
    )

    setActionError('')

    try {

      let result


      /**
       * ------------------------------------------------------
       * USER EMAIL CREATION REQUEST
       * ------------------------------------------------------
       */
      if (
        item.taskType ===
        'user-email-creation-request'
      ) {

        result =
          await processUserEmailCreationRequest(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * WELCOME EMAIL
       * ------------------------------------------------------
       */
      else if (
        item.taskType ===
        'welcome-email'
      ) {

        result =
          await processWelcomeAboardEmail(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * DIRECTOR EMAIL
       * ------------------------------------------------------
       */
      else if (
        item.taskType ===
        'director-email'
      ) {

        result =
          await processDirectorEmail(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * WORKSPACE USER CREATION
       * ------------------------------------------------------
       */
      else if (
        item.taskType ===
        'workspace-email-creation'
      ) {

        result =
          await createWorkspaceUserFromTask(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * CALENDAR
       * ------------------------------------------------------
       */
      else if (
        item.taskType ===
        'calendar-invite'
      ) {

        result =
          await createCalendarInvite(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * HR TEAM NOTIFICATION
       * ------------------------------------------------------
       *
       * This endpoint exists in the backend,
       * so we use the generic API route through
       * a direct request helper when needed.
       *
       * The dedicated function is added below
       * through dynamic import to keep this file
       * compatible with the current api.js.
       */
      else if (
        item.taskType ===
        'hr-team-notification'
      ) {

        const {
          processHRTeamNotification,
        } =
          await import(
            '../../services/api'
          )

        result =
          await processHRTeamNotification(
            item.id
          )

      }

      /**
       * ------------------------------------------------------
       * STAKEHOLDER NOTIFICATION
       * ------------------------------------------------------
       *
       * Automatic processing is handled by the
       * backend scheduler.
       *
       * This task does not get manually executed
       * from the drawer.
       */
      else if (
        item.taskType ===
        'stakeholder-notification'
      ) {

        throw new Error(
          'Stakeholder Notification is processed automatically according to its scheduled date and time.'
        )

      }

      else {

        throw new Error(
          'This task does not have an automated action.'
        )
      }


      /**
       * Refresh checklist from backend.
       */
      if (onTaskChanged) {

        await onTaskChanged(
          `${item.task} completed successfully.`
        )

      } else {

        onClose()

      }


      return result

    } catch (error) {

      console.error(
        'Failed to process task:',
        error
      )

      setActionError(
        error?.message ||
        'Task processing failed.'
      )

    } finally {

      setSaving(
        false
      )
    }
  }

  /**
 * ==========================================================
 * COMPLETE MANUAL TASK
 * ==========================================================
 */
async function handleCompleteManualTask() {

  if (!item) {
    return
  }


  if (
    !canStart
  ) {
    return
  }


  /**
   * Buddy Assigned requires a buddy.
   */
  if (
    item.taskType ===
      'buddy-assigned' &&
    !String(
      assignedTo || ''
    ).trim()
  ) {

    setActionError(
      'Please select a buddy before marking this task complete.'
    )

    return
  }


  setSaving(
    true
  )

  setActionError('')


  try {

    await completeManualPreboardingTask(
      item.id,
      {
        Notes:
          notes,

        Assigned_To:
          assignedTo,
      },
    )


    if (
      onTaskChanged
    ) {

      await onTaskChanged(
        `${item.task} completed successfully.`
      )

    } else {

      onClose()

    }

  } catch (error) {

    console.error(
      'Failed to complete manual task:',
      error,
    )

    setActionError(
      error?.message ||
      'Failed to complete manual task.'
    )

  } finally {

    setSaving(
      false
    )
  }
}
  /**
   * ==========================================================
   * MANUAL TASK SAVE
   * ==========================================================
   *
   * Notes/assignment can still be saved.
   *
   * Completion itself must use the backend workflow
   * completion function, so we do not directly change
   * Status to Completed here.
   */
  async function handleSaveDetails() {

    if (!item) {
      return
    }

    setSaving(
      true
    )

    setActionError('')

    try {

      await updatePreboardingTask(
        item.id,
        {
          Notes:
            notes,

          Assigned_To:
            assignedTo,
        }
      )


      if (onTaskChanged) {

        await onTaskChanged(
          'Task details updated.'
        )

      } else {

        onClose()

      }

    } catch (error) {

      console.error(
        'Failed to save task details:',
        error
      )

      setActionError(
        error?.message ||
        'Failed to save task details.'
      )

    } finally {

      setSaving(
        false
      )
    }
  }


  /**
   * ==========================================================
   * CALENDAR EDIT
   * ==========================================================
   *
   * Parent currently owns the Calendar editing flow.
   */
  function handleCalendarEdit() {

    if (!calendarTask) {
      return
    }

    if (
      onOpenCalendarEdit
    ) {

      onOpenCalendarEdit()

      return
    }

    setActionError(
      'Calendar editor is not connected yet.'
    )
  }


  /**
   * ==========================================================
   * RENDER
   * ==========================================================
   */
  if (
    !item ||
    !employee
  ) {
    return null
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
      maxWidth="sm"
    >

      {/* ======================================================
          TITLE
          ====================================================== */}
      <DialogTitle
        sx={{
          display:
            'flex',

          justifyContent:
            'space-between',

          alignItems:
            'flex-start',

          gap:
            2,
        }}
      >

        <Box
          sx={{
            minWidth:
              0,
          }}
        >

          <Typography
            variant="h6"
            sx={{
              fontWeight:
                600,
            }}
          >
            {item.task}
          </Typography>


          <Stack
            direction="row"
            spacing={1}
            sx={{
              mt:
                1,

              alignItems:
                'center',

              flexWrap:
                'wrap',
            }}
          >

            <Chip
              label={
                status
              }

              size="small"

              sx={{
                backgroundColor:
                  statusStyles.backgroundColor,

                color:
                  statusStyles.color,

                fontWeight:
                  600,
              }}
            />


            {getActionLabel(item) && (

              <Chip
                label={
                  getActionLabel(item)
                }

                size="small"

                variant="outlined"
              />

            )}


            {item.templateId && (

              <Chip
                label={
                  item.templateId
                }

                size="small"

                variant="outlined"
              />

            )}

          </Stack>


          {status ===
            'Completed' && (
            <Typography
              variant="caption"
              sx={{
                color:
                  '#5F6368',

                display:
                  'block',

                mt:
                  0.8,
              }}
            >
              Completed{' '}
              {formatDateDisplay(
                item.completedAt
              )}
            </Typography>
          )}


          {status ===
            'Scheduled' && (
            <Typography
              variant="caption"
              sx={{
                color:
                  '#5F6368',

                display:
                  'block',

                mt:
                  0.8,
              }}
            >
              Scheduled{' '}
              {formatDateDisplay(
                item.scheduledDate ||
                item.dueDate
              )}

              {item.scheduledTime
                ? ` at ${formatTime12(
                    item.scheduledTime
                  )}`
                : ''}
            </Typography>
          )}

        </Box>


        <Button
          onClick={
            onClose
          }
          size="small"
          startIcon={
            <Close />
          }
          disabled={
            saving
          }
        >
          Close
        </Button>

      </DialogTitle>


      <DialogContent
        dividers
      >

        <Stack
          spacing={2.5}
        >

          {/* ==================================================
              DESCRIPTION
              ================================================== */}
          <Box>

            <Typography
              variant="caption"
              sx={{
                color:
                  '#5F6368',

                textTransform:
                  'uppercase',

                letterSpacing:
                  '0.04em',
              }}
            >
              Description
            </Typography>


            <Typography
              variant="body2"
              sx={{
                mt:
                  0.5,
              }}
            >
              {item.description}
            </Typography>

          </Box>


          <Divider />


          {/* ==================================================
              EMPLOYEE
              ================================================== */}
          <Box>

            <Typography
              variant="caption"
              sx={{
                color:
                  '#5F6368',

                textTransform:
                  'uppercase',

                letterSpacing:
                  '0.04em',
              }}
            >
              Employee
            </Typography>


            <Typography
              variant="body2"
              sx={{
                mt:
                  0.5,

                fontWeight:
                  600,
              }}
            >
              {employee.firstName}{' '}
              {employee.lastName}
            </Typography>


            <Typography
              variant="body2"
              sx={{
                color:
                  '#5F6368',
              }}
            >
              {employee.employeeId}
            </Typography>

          </Box>


          {/* ==================================================
              EMAIL TEMPLATE
              ================================================== */}
          {emailTask && (

            <Box>

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.04em',
                }}
              >
                Email Template
              </Typography>


              <Stack
                direction={{
                  xs:
                    'column',
                  sm:
                    'row',
                }}

                spacing={1}

                sx={{
                  mt:
                    1,
                }}
              >

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    onViewTemplate?.()
                  }
                  disabled={
                    !item.templateId ||
                    saving
                  }
                >
                  View Template
                </Button>

              </Stack>

            </Box>

          )}


          {/* ==================================================
              CALENDAR
              ================================================== */}
          {calendarTask && (

            <Box>

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.04em',
                }}
              >
                Calendar
              </Typography>


              <Stack
                direction={{
                  xs:
                    'column',
                  sm:
                    'row',
                }}

                spacing={1}

                sx={{
                  mt:
                    1,
                }}
              >

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    onViewTemplate?.()
                  }
                  disabled={
                    saving
                  }
                >
                  View Template
                </Button>


                <Button
                  variant="outlined"
                  size="small"
                  startIcon={
                    <Edit />
                  }
                  onClick={
                    handleCalendarEdit
                  }
                  disabled={
                    saving ||
                    normalizedStatus ===
                      'completed'
                  }
                >
                  Edit
                </Button>

              </Stack>


              {item.calendarStartDate && (

                <Typography
                  variant="body2"
                  sx={{
                    mt:
                      1.5,

                    color:
                      '#5F6368',
                  }}
                >
                  {formatDateDisplay(
                    item.calendarStartDate
                  )}

                  {item.calendarStartTime &&
                    ` • ${formatTime12(
                      item.calendarStartTime
                    )}`}

                  {item.calendarEndTime &&
                    ` – ${formatTime12(
                      item.calendarEndTime
                    )}`}
                </Typography>

              )}

            </Box>

          )}


          {/* ==================================================
              STAKEHOLDER SCHEDULE
              ================================================== */}
          {item.taskType ===
            'stakeholder-notification' && (

            <Box>

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.04em',
                }}
              >
                Notification Schedule
              </Typography>


              <Stack
                spacing={0.5}
                sx={{
                  mt:
                    1,
                }}
              >

                <Typography
                  variant="body2"
                >
                  Mode:{' '}
                  <strong>
                    {item.scheduleMode ===
                    'custom'
                      ? 'Custom'
                      : 'Automatic'}
                  </strong>
                </Typography>


                {item.scheduledDate && (

                  <Typography
                    variant="body2"
                  >
                    Date:{' '}
                    {formatDateDisplay(
                      item.scheduledDate
                    )}
                  </Typography>

                )}


                {item.scheduledTime && (

                  <Typography
                    variant="body2"
                  >
                    Time:{' '}
                    {formatTime12(
                      item.scheduledTime
                    )}
                  </Typography>

                )}

              </Stack>

            </Box>

          )}


          {/* ==================================================
              NOTES / ASSIGNMENT
              ================================================== */}
          {canEditTask && (

            <Box>

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  textTransform:
                    'uppercase',

                  letterSpacing:
                    '0.04em',
                }}
              >
                Task Details
              </Typography>


              <Stack
                spacing={2}
                sx={{
                  mt:
                    1,
                }}
              >

                <TextField
                  label="Notes"
                  multiline
                  minRows={3}
                  value={
                    notes
                  }
                  onChange={
                    event =>
                      setNotes(
                        event.target.value
                      )
                  }
                  disabled={
                    saving
                  }
                />


                {!(
                  item.taskType ===
                  'stakeholder-notification'
                ) && (

                  <FormControl
                    fullWidth
                    size="small"
                  >

                    <InputLabel>
                      Assigned To
                    </InputLabel>

                    <Select
                      label="Assigned To"
                      value={
                        assignedTo
                      }
                      onChange={
                        event =>
                          setAssignedTo(
                            event.target.value
                          )
                      }
                      disabled={
                        saving
                      }
                    >

                      <MenuItem value="">
                        Unassigned
                      </MenuItem>

                      <MenuItem value="Anushka HR">
                        Anushka HR
                      </MenuItem>

                      <MenuItem value="Bhavana HR">
                        Bhavana HR
                      </MenuItem>

                      <MenuItem value="Priya HR">
                        Priya HR
                      </MenuItem>

                    </Select>

                  </FormControl>

                )}

              </Stack>

            </Box>

          )}


          {/* ==================================================
              MANUAL TASK
              ================================================== */}
          {manualTask && (
  <Box
    sx={{
      p: 1.5,
      borderRadius: 1,
      backgroundColor: '#F8F9FA',
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: '#5F6368',
      }}
    >
      This is a manual HR action.
      {item.taskType === 'buddy-assigned'
        ? ' Select the assigned buddy and then mark the task complete.'
        : ' Complete this task after the required documentation has been verified.'}
    </Typography>
  </Box>
)}


          {/* ==================================================
              WORKSPACE TASK
              ================================================== */}
          {workspaceTask && (

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
                variant="body2"
                sx={{
                  color:
                    '#5F6368',
                }}
              >
                This task creates the employee's Google Workspace account. It does not use an email template.
              </Typography>

            </Box>

          )}


          {/* ==================================================
              SYSTEM TASK
              ================================================== */}
          {systemTask && (

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
                variant="body2"
                sx={{
                  color:
                    '#5F6368',
                }}
              >
                This task is completed automatically by the workflow.
              </Typography>

            </Box>

          )}


          {/* ==================================================
              ERROR
              ================================================== */}
          {actionError && (

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
                {actionError}
              </Typography>

            </Box>

          )}

        </Stack>

      </DialogContent>


      {/* ======================================================
          ACTIONS
          ====================================================== */}
      <DialogActions
        sx={{
          px:
            3,

          py:
            2,

          gap:
            1,

          flexWrap:
            'wrap',
        }}
      >

        <Button
          onClick={
            onClose
          }
          color="inherit"
          disabled={
            saving
          }
        >
          Cancel
        </Button>


        {/* ====================================================
            SAVE NOTES / ASSIGNMENT
            ==================================================== */}
        {canEditTask &&
          (
            notes !==
              (item.notes || '') ||
            assignedTo !==
              (item.assignedTo || '')
          ) && (

          <Button
            variant="outlined"
            onClick={
              handleSaveDetails
            }
            disabled={
              saving
            }
          >
            Save Details
          </Button>

        )}

        {/* ====================================================
    MANUAL TASK COMPLETION
    ==================================================== */}
{manualTask &&
  canStart && (
    <Button
      variant="contained"
      startIcon={
        saving ? (
          <CircularProgress
            size={18}
            color="inherit"
          />
        ) : (
          <TaskAlt />
        )
      }
      onClick={
        handleCompleteManualTask
      }
      disabled={
        saving ||
        (
          item.taskType ===
            'buddy-assigned' &&
          !String(
            assignedTo || ''
          ).trim()
        )
      }
    >
      {saving
        ? 'Completing...'
        : 'Mark Complete'}
    </Button>
  )}

        {/* ====================================================
            AUTOMATED ACTION
            ==================================================== */}
        {canStart &&
          (
            emailTask ||
            workspaceTask ||
            calendarTask
          ) && (

          <Button
            variant="contained"
            startIcon={
              saving
                ? (
                  <CircularProgress
                    size={18}
                    color="inherit"
                  />
                )
                : (
                  <TaskAlt />
                )
            }
            onClick={
              handleProcessTask
            }
            disabled={
              saving
            }
          >
            {saving
              ? 'Processing...'
              : calendarTask
                ? 'Create Calendar'
                : workspaceTask
                  ? 'Create Workspace Account'
                  : 'Process Task'}
          </Button>

        )}


        {/* ====================================================
            STAKEHOLDER AUTOMATION
            ==================================================== */}
        {item.taskType ===
          'stakeholder-notification' &&
          normalizedStatus ===
            'scheduled' && (

          <Typography
            variant="caption"
            sx={{
              color:
                '#5F6368',

              ml:
                1,
            }}
          >
            This notification will be processed automatically at the scheduled time.
          </Typography>

        )}


        {/* ====================================================
            COMPLETED
            ==================================================== */}
        {normalizedStatus ===
          'completed' && (

          <Typography
            variant="caption"
            sx={{
              color:
                '#188038',

              ml:
                1,
            }}
          >
            Task completed.
          </Typography>

        )}

      </DialogActions>

    </Dialog>
  )
}


export default ChecklistDetailDrawer