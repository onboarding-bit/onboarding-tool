/**
 * ============================================================
 * APPS SCRIPT API SERVICE
 * ============================================================
 *
 * Central API layer for the Employee Lifecycle Dashboard.
 *
 * React components should use these functions instead of
 * calling fetch() directly.
 */


/**
 * ============================================================
 * API BASE URL
 * ============================================================
 *
 * Recommended:
 *
 * .env
 * VITE_API_BASE_URL=https://script.google.com/macros/s/XXXX/exec
 *
 * IMPORTANT:
 * This must be the deployed Apps Script Web App URL.
 *
 * It is NOT the Apps Script editor URL.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || ''


/**
 * ============================================================
 * VALIDATE API URL
 * ============================================================
 */
function validateApiUrl() {

  if (!API_BASE_URL) {
    throw new Error(
      'Apps Script API URL is not configured. Add VITE_API_BASE_URL to the frontend .env file.'
    )
  }

}


/**
 * ============================================================
 * GET REQUEST
 * ============================================================
 */
async function getRequest(
  action,
  params = {},
) {

  validateApiUrl()


  const searchParams =
    new URLSearchParams({
      action,
      ...params,
    })


  const response =
    await fetch(
      `${API_BASE_URL}?${searchParams.toString()}`,
      {
        method:
          'GET',

        headers: {
          Accept:
            'application/json',
        },
      },
    )


  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    )

  }


  const data =
    await response.json()


  if (
    data &&
    data.success === false
  ) {

    throw new Error(
      data.error ||
      'Backend request failed.'
    )

  }


  return data
}


/**
 * ============================================================
 * POST REQUEST
 * ============================================================
 *
 * IMPORTANT:
 *
 * We intentionally use:
 *
 * Content-Type: text/plain;charset=utf-8
 *
 * instead of:
 *
 * Content-Type: application/json
 *
 * This avoids the browser's JSON CORS preflight when
 * communicating with the Apps Script Web App.
 *
 * Apps Script still receives the JSON string through:
 *
 * e.postData.contents
 *
 * and Code.gs already does:
 *
 * JSON.parse(e.postData.contents)
 */
async function postRequest(
  action,
  payload = {},
) {

  validateApiUrl()


  const requestBody =
    JSON.stringify({
      action,

      ...payload,
    })


  const response =
    await fetch(
      API_BASE_URL,
      {
        method:
          'POST',

        headers: {
          Accept:
            'application/json',

          'Content-Type':
            'text/plain;charset=utf-8',
        },

        body:
          requestBody,
      },
    )


  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    )

  }


  const data =
    await response.json()


  if (
    data &&
    data.success === false
  ) {

    throw new Error(
      data.error ||
      'Backend request failed.'
    )

  }


  return data
}


/**
 * ============================================================
 * HEALTH
 * ============================================================
 */
export async function getHealth() {

  return getRequest(
    'health',
  )

}


/**
 * ============================================================
 * EMPLOYEES
 * ============================================================
 */


/**
 * Get all employees.
 */
export async function getEmployees() {

  const data =
    await getRequest(
      'getEmployees',
    )


  return (
    data.employees ||
    []
  )

}


/**
 * Get employees with preboarding tasks and progress
 * in a single request.
 */
export async function getEmployeesWithPreboardingData() {

  const data =
    await getRequest(
      'getEmployeesWithPreboardingData',
    )


  return (
    data.employees ||
    []
  )

}


/**
 * Complete a manual preboarding task.
 */
export async function completeManualPreboardingTask(
  taskId,
  updates = {},
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'completeManualPreboardingTask',
    {
      taskId,

      updates,
    },
  )

}


/**
 * Get one employee by Internal_ID.
 */
export async function getEmployee(
  internalId,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await getRequest(
      'getEmployee',
      {
        id:
          internalId,
      },
    )


  return (
    data.employee ||
    null
  )

}


/**
 * Create employee.
 *
 * Employee creation and checklist creation are
 * separate backend operations.
 */
export async function createEmployee(
  employee,
) {

  const data =
    await postRequest(
      'createEmployee',
      {
        employee,
      },
    )


  return data.employee

}


/**
 * Update employee.
 */
export async function updateEmployee(
  internalId,
  updates,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await postRequest(
      'updateEmployee',
      {
        internalId,

        updates,
      },
    )


  return data.employee

}


/**
 * ============================================================
 * PREBOARDING TASKS
 * ============================================================
 */


/**
 * Get all tasks for one employee.
 */
export async function getPreboardingTasks(
  internalId,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await getRequest(
      'getPreboardingTasks',
      {
        internalId,
      },
    )


  return (
    data.tasks ||
    []
  )

}


/**
 * Get calculated preboarding progress.
 */
export async function getPreboardingProgress(
  internalId,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await getRequest(
      'getPreboardingProgress',
      {
        internalId,
      },
    )


  return (
    data.progress || {
      percentage:
        0,

      completed:
        0,

      total:
        0,
    }
  )

}


/**
 * Create all preboarding tasks.
 */
export async function createPreboardingTasks(
  internalId,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await postRequest(
      'createPreboardingTasks',
      {
        internalId,
      },
    )


  return (
    data.tasks ||
    []
  )

}


/**
 * Get one preboarding task.
 */
export async function getPreboardingTask(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const data =
    await getRequest(
      'getPreboardingTask',
      {
        taskId,
      },
    )


  return (
    data.task ||
    null
  )

}


/**
 * Update general task fields.
 *
 * IMPORTANT:
 *
 * Automated completion should use the specific
 * process endpoint rather than changing Status directly.
 */
export async function updatePreboardingTask(
  taskId,
  updates,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const data =
    await postRequest(
      'updatePreboardingTask',
      {
        taskId,

        updates,
      },
    )


  return data.task

}


/**
 * ============================================================
 * HR TEAM NOTIFICATION
 * ============================================================
 */
export async function processHRTeamNotification(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'processHRTeamNotification',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * STAKEHOLDER NOTIFICATION
 * ============================================================
 */


/**
 * Save custom stakeholder date/time.
 */
export async function saveCustomStakeholderSchedule(
  taskId,
  scheduledDate,
  scheduledTime,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const data =
    await postRequest(
      'saveCustomStakeholderSchedule',
      {
        taskId,

        scheduledDate,

        scheduledTime,
      },
    )


  return data.task

}


/**
 * Restore automatic stakeholder date/time.
 */
export async function restoreAutomaticStakeholderSchedule(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const data =
    await postRequest(
      'restoreAutomaticStakeholderSchedule',
      {
        taskId,
      },
    )


  return data.task

}


/**
 * Recalculate automatic stakeholder schedule.
 */
export async function reconcileStakeholderSchedule(
  internalId,
) {

  if (!internalId) {

    throw new Error(
      'Internal_ID is required.'
    )

  }


  const data =
    await postRequest(
      'reconcileStakeholderSchedule',
      {
        internalId,
      },
    )


  return data.task

}


/**
 * Run stakeholder notification processor.
 *
 * Primarily useful for backend/admin testing.
 */
export async function processStakeholderNotifications() {

  return postRequest(
    'processStakeholderNotifications',
  )

}


/**
 * ============================================================
 * USER EMAIL CREATION REQUEST
 * ============================================================
 */
export async function processUserEmailCreationRequest(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'processUserEmailCreationRequest',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * WORKSPACE EMAIL ID CREATION
 * ============================================================
 *
 * Backend action expected:
 *
 * createWorkspaceUser
 */
export async function createWorkspaceUserFromTask(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'createWorkspaceUser',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * WELCOME ABOARD EMAIL
 * ============================================================
 */
export async function processWelcomeAboardEmail(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'processWelcomeAboardEmail',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * DIRECTOR EMAIL
 * ============================================================
 */
export async function processDirectorEmail(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'processDirectorEmail',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * EMAIL TEMPLATES
 * ============================================================
 */


/**
 * Get all email templates.
 */
export async function getEmailTemplates() {

  const data =
    await getRequest(
      'getEmailTemplates',
    )


  return (
    data.templates ||
    []
  )

}


/**
 * Get one email template.
 */
export async function getEmailTemplate(
  templateId,
) {

  if (!templateId) {

    throw new Error(
      'Template_ID is required.'
    )

  }


  const data =
    await getRequest(
      'getEmailTemplate',
      {
        templateId,
      },
    )


  return data.template

}


/**
 * Update editable email-template fields.
 */
export async function updateEmailTemplate(
  templateId,
  updates,
) {

  if (!templateId) {

    throw new Error(
      'Template_ID is required.'
    )

  }


  const data =
    await postRequest(
      'updateEmailTemplate',
      {
        templateId,

        updates,
      },
    )


  return data.template

 }


/**
 * ============================================================
 * CALENDAR
 * ============================================================
 */


/**
 * Get Calendar details/template for a task.
 */
export async function getCalendarDetails(
  taskId,
  templateId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const params = {
    taskId,
  }


  if (templateId) {

    params.templateId =
      templateId

  }


  const data =
    await getRequest(
      'getCalendarDetails',
      params,
    )


  return data.details

}


/**
 * Save edited Calendar details.
 */
export async function saveCalendarDetails(
  taskId,
  details,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  const data =
    await postRequest(
      'saveCalendarDetails',
      {
        taskId,

        details,
      },
    )


  return data

}


/**
 * Create Calendar event + Google Meet.
 */
export async function createCalendarInvite(
  taskId,
) {

  if (!taskId) {

    throw new Error(
      'Task_ID is required.'
    )

  }


  return postRequest(
    'createCalendarInvite',
    {
      taskId,
    },
  )

}


/**
 * ============================================================
 * EXPORT API OBJECT
 * ============================================================
 *
 * Optional convenience object.
 */
const api = {

  getHealth,

  getEmployees,
  getEmployeesWithPreboardingData,
  getEmployee,
  createEmployee,
  updateEmployee,

  getPreboardingTasks,
  getPreboardingProgress,
  createPreboardingTasks,
  getPreboardingTask,
  updatePreboardingTask,
  completeManualPreboardingTask,

  processHRTeamNotification,

  saveCustomStakeholderSchedule,
  restoreAutomaticStakeholderSchedule,
  reconcileStakeholderSchedule,
  processStakeholderNotifications,

  processUserEmailCreationRequest,

  createWorkspaceUserFromTask,

  processWelcomeAboardEmail,
  processDirectorEmail,

  getEmailTemplates,
  getEmailTemplate,
  updateEmailTemplate,

  getCalendarDetails,
  saveCalendarDetails,
  createCalendarInvite,
}


export default api