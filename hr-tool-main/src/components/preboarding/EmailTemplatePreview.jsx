import { Close } from '@mui/icons-material'
import { useEffect, useMemo, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import {
  getEmailTemplate,
  getCalendarDetails,
} from '../../services/api'


/**
 * ============================================================
 * FORMAT EMPLOYEE VARIABLES
 * ============================================================
 */
function getEmployeeVariables(
  employee
) {

  if (!employee) {
    return {}
  }

  const fullName =
    `${employee.firstName || ''} ${employee.lastName || ''}`
      .trim()

  return {

    firstName:
      employee.firstName || '',

    lastName:
      employee.lastName || '',

    fullName,

    employeeId:
      employee.employeeId || '',

    designation:
      employee.designation || '',

    department:
      employee.department || '',

    employmentType:
      employee.employmentType || '',

    joiningDate:
      employee.joiningDate || '',

    personalEmail:
      employee.personalEmail || '',

    workEmail:
      employee.workEmail || '',

    reportingManager:
      employee.reportingManager || '',

    workLocation:
      employee.workLocation || '',
  }
}


/**
 * ============================================================
 * RENDER TEMPLATE VARIABLES
 * ============================================================
 */
function renderTemplate(
  content,
  variables
) {

  let rendered =
    String(
      content || ''
    )

  Object.keys(
    variables || {}
  ).forEach(
    key => {

      const value =
        variables[key] ===
          undefined ||
        variables[key] ===
          null
          ? ''
          : String(
              variables[key]
            )

      const escapedKey =
        key.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        )

      const pattern =
        new RegExp(
          `{{\\s*${escapedKey}\\s*}}`,
          'g'
        )

      rendered =
        rendered.replace(
          pattern,
          value
        )
    }
  )

  return rendered
}


/**
 * ============================================================
 * CLEAN HTML FOR PREVIEW
 * ============================================================
 *
 * The template is already HTML in the backend.
 *
 * We render it inside an isolated container.
 */
function renderEmailBody(
  html
) {

  if (!html) {
    return (
      <Typography
        variant="body2"
        sx={{
          color:
            '#5F6368',
        }}
      >
        This template does not have a body.
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        '& img': {
          maxWidth:
            '100%',
        },

        '& table': {
          maxWidth:
            '100%',
        },

        '& a': {
          color:
            '#1A73E8',
        },

        lineHeight:
          1.6,
      }}
      dangerouslySetInnerHTML={{
        __html:
          html,
      }}
    />
  )
}


/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */
function EmailTemplatePreview({
  open,
  onClose,
  task,
  employee,
}) {

  const [
    loading,
    setLoading,
  ] =
    useState(false)


  const [
    error,
    setError,
  ] =
    useState('')


  const [
    template,
    setTemplate,
  ] =
    useState(null)


  const [
    calendarDetails,
    setCalendarDetails,
  ] =
    useState(null)


  /**
   * ==========================================================
   * LOAD TEMPLATE
   * ==========================================================
   */
  useEffect(() => {

    if (
      !open ||
      !task
    ) {
      return
    }

    let cancelled =
      false


    async function loadTemplate() {

      setLoading(
        true
      )

      setError(
        ''
      )

      setTemplate(
        null
      )

      setCalendarDetails(
        null
      )


      try {

        /**
         * ----------------------------------------------------
         * EMAIL TEMPLATE
         * ----------------------------------------------------
         */
        if (
          task.actionType ===
          'email'
        ) {

          if (
            !task.templateId
          ) {
            throw new Error(
              'This email task has no Template_ID.'
            )
          }


          const result =
            await getEmailTemplate(
              task.templateId
            )


          if (
            cancelled
          ) {
            return
          }


          setTemplate(
            result
          )
        }


        /**
         * ----------------------------------------------------
         * CALENDAR TEMPLATE
         * ----------------------------------------------------
         */
        else if (
          task.actionType ===
          'calendar'
        ) {

          const details =
            await getCalendarDetails(
              task.id,
              task.templateId
            )


          if (
            cancelled
          ) {
            return
          }


          setCalendarDetails(
            details
          )
        }


      } catch (loadError) {

        console.error(
          'Failed to load template:',
          loadError
        )


        if (
          !cancelled
        ) {

          setError(
            loadError?.message ||
            'Failed to load template.'
          )
        }

      } finally {

        if (
          !cancelled
        ) {

          setLoading(
            false
          )
        }
      }
    }


    loadTemplate()


    return () => {
      cancelled =
        true
    }

  }, [
    open,
    task,
  ])


  /**
   * ==========================================================
   * RENDER VARIABLES
   * ==========================================================
   */
  const variables =
    useMemo(
      () =>
        getEmployeeVariables(
          employee
        ),
      [
        employee,
      ],
    )


  /**
   * ==========================================================
   * EMAIL SUBJECT
   * ==========================================================
   */
  const renderedSubject =
    useMemo(() => {

      if (
        !template
      ) {
        return ''
      }

      return renderTemplate(
        template.Subject ||
        '',
        variables
      )

    }, [
      template,
      variables,
    ])


  /**
   * ==========================================================
   * EMAIL BODY
   * ==========================================================
   */
  const renderedBody =
    useMemo(() => {

      if (
        !template
      ) {
        return ''
      }

      return renderTemplate(
        template.Body_HTML ||
        '',
        variables
      )

    }, [
      template,
      variables,
    ])


  /**
   * ==========================================================
   * CALENDAR TITLE
   * ==========================================================
   */
  const renderedCalendarTitle =
    useMemo(() => {

      if (
        !calendarDetails
      ) {
        return ''
      }

      return renderTemplate(
        calendarDetails.title ||
        '',
        variables
      )

    }, [
      calendarDetails,
      variables,
    ])


  /**
   * ==========================================================
   * CALENDAR DESCRIPTION
   * ==========================================================
   */
  const renderedCalendarDescription =
    useMemo(() => {

      if (
        !calendarDetails
      ) {
        return ''
      }

      return renderTemplate(
        calendarDetails.description ||
        '',
        variables
      )

    }, [
      calendarDetails,
      variables,
    ])


  if (
    !task
  ) {
    return null
  }


  const isEmail =
    task.actionType ===
    'email'


  const isCalendar =
    task.actionType ===
    'calendar'


  return (
    <Dialog
      open={
        open
      }
      onClose={
        onClose
      }
      fullWidth
      maxWidth="md"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}
      <DialogTitle
        sx={{
          display:
            'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center',

          gap:
            2,
        }}
      >

        <Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight:
                600,
            }}
          >
            {isEmail
              ? 'Email Template Preview'
              : 'Calendar Template Preview'}
          </Typography>


          <Typography
            variant="caption"
            sx={{
              color:
                '#5F6368',

              display:
                'block',

              mt:
                0.4,
            }}
          >
            {task.task}
            {task.templateId
              ? ` • ${task.templateId}`
              : ''}
          </Typography>

        </Box>


        <Button
          onClick={
            onClose
          }
          size="small"
          startIcon={
            <Close />
          }
        >
          Close
        </Button>

      </DialogTitle>


      <DialogContent
        dividers
      >

        {/* ====================================================
            LOADING
            ==================================================== */}
        {loading && (

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

        )}


        {/* ====================================================
            ERROR
            ==================================================== */}
        {!loading &&
          error && (

          <Box
            sx={{
              p:
                2,

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


        {/* ====================================================
            EMAIL
            ==================================================== */}
        {!loading &&
          !error &&
          isEmail &&
          template && (

          <Stack
            spacing={2.5}
          >

            {/* ------------------------------------------------
                EMAIL HEADER
                ------------------------------------------------ */}
            <Paper
              variant="outlined"
              sx={{
                p:
                  2,

                borderRadius:
                  1.5,
              }}
            >

              <Stack
                spacing={1}
              >

                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Template
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight:
                        600,
                    }}
                  >
                    {template.Template_Name ||
                      task.templateId}
                  </Typography>

                </Box>


                <Divider />


                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Subject
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight:
                        600,

                      mt:
                        0.3,
                    }}
                  >
                    {renderedSubject ||
                      '(No subject)'}
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Recipient
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt:
                        0.3,
                    }}
                  >
                    {task.taskType ===
                    'welcome-email'
                      ? employee?.personalEmail ||
                        'Candidate Personal Email'
                      : task.taskType ===
                          'user-email-creation-request'
                        ? 'User Email Creation Team'
                        : task.taskType ===
                            'director-email'
                          ? 'Director Team'
                          : task.taskType ===
                              'stakeholder-notification'
                            ? 'Stakeholder Team'
                            : 'Configured Recipient'}
                  </Typography>

                </Box>

              </Stack>

            </Paper>


            {/* ------------------------------------------------
                ACTUAL EMAIL BODY
                ------------------------------------------------ */}
            <Paper
              variant="outlined"
              sx={{
                p:
                  3,

                minHeight:
                  300,

                borderRadius:
                  1.5,

                backgroundColor:
                  '#FFFFFF',
              }}
            >

              {renderEmailBody(
                renderedBody
              )}

            </Paper>


            {/* ------------------------------------------------
                RENDERED VALUES
                ------------------------------------------------ */}
            <Box
              sx={{
                p:
                  2,

                borderRadius:
                  1.5,

                backgroundColor:
                  '#F8F9FA',
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  display:
                    'block',

                  mb:
                    1,
                }}
              >
                Rendered for
              </Typography>


              <Typography
                variant="body2"
              >
                {employee?.firstName}{' '}
                {employee?.lastName}
              </Typography>


              <Typography
                variant="body2"
                sx={{
                  color:
                    '#5F6368',
                }}
              >
                {employee?.employeeId}
              </Typography>

            </Box>

          </Stack>

        )}


        {/* ====================================================
            CALENDAR
            ==================================================== */}
        {!loading &&
          !error &&
          isCalendar &&
          calendarDetails && (

          <Stack
            spacing={2.5}
          >

            <Paper
              variant="outlined"
              sx={{
                p:
                  2.5,

                borderRadius:
                  1.5,
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  display:
                    'block',

                  mb:
                    0.5,
                }}
              >
                Calendar Title
              </Typography>


              <Typography
                variant="h6"
                sx={{
                  fontWeight:
                    600,
                }}
              >
                {renderedCalendarTitle}
              </Typography>

            </Paper>


            <Paper
              variant="outlined"
              sx={{
                p:
                  2.5,

                borderRadius:
                  1.5,
              }}
            >

              <Stack
                spacing={1.5}
              >

                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Date
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    {calendarDetails.startDate ||
                      ''}
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Time
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    {calendarDetails.startTime ||
                      ''}
                    {' – '}
                    {calendarDetails.endTime ||
                      ''}
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Location
                  </Typography>

                  <Typography
                    variant="body2"
                  >
                    {calendarDetails.location ||
                      ''}
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        '#5F6368',
                    }}
                  >
                    Internal Attendees
                  </Typography>

                  {(
                    calendarDetails.internalAttendees ||
                    []
                  ).length === 0 ? (

                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          '#5F6368',
                      }}
                    >
                      None
                    </Typography>

                  ) : (

                    calendarDetails
                      .internalAttendees
                      .map(
                        attendee => (

                          <Typography
                            key={
                              attendee
                            }
                            variant="body2"
                          >
                            • {attendee}
                          </Typography>

                        )
                      )

                  )}

                </Box>

              </Stack>

            </Paper>


            <Paper
              variant="outlined"
              sx={{
                p:
                  3,

                borderRadius:
                  1.5,

                backgroundColor:
                  '#FFFFFF',
              }}
            >

              <Typography
                variant="caption"
                sx={{
                  color:
                    '#5F6368',

                  display:
                    'block',

                  mb:
                    1,
                }}
              >
                Event Description
              </Typography>


              <Box
                sx={{
                  whiteSpace:
                    'pre-line',

                  lineHeight:
                    1.6,
                }}
              >
                <Typography
                  variant="body2"
                >
                  {
                    renderedCalendarDescription
                  }
                </Typography>
              </Box>

            </Paper>

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
          variant="contained"
        >
          Close
        </Button>

      </DialogActions>

    </Dialog>
  )
}


export default EmailTemplatePreview