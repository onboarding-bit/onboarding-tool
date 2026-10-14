import { getEmployeeDisplayName } from './nameUtils'
import { formatDateDisplay, formatDateISO, addDays } from './dateUtils'
import { stakeholderRecipients } from '../data/stakeholderRecipients'

const parseDateString = (value) => new Date(value).getTime() || 0

export const getEmployeeById = (employees, id) => employees.find((employee) => employee.id === id)

export const getEmployeesByStage = (employees, stage) => employees.filter((employee) => employee.lifecycleStage === stage)

export const filterEmployees = (employees, filters = {}) => {
  const { search = '', department = 'All', employmentType = 'All', status = 'All' } = filters
  return employees.filter((employee) => {
    const display = getEmployeeDisplayName(employee)
    const searchText = `${display} ${employee.designation} ${employee.employeeId || ''} ${employee.personalEmail || employee.email || ''} ${employee.workEmail || ''}`.toLowerCase()
    const matchesSearch = searchText.includes(search.toLowerCase())
    const matchesDepartment = department === 'All' || employee.department === department
    const matchesType = employmentType === 'All' || employee.employmentType === employmentType
    const matchesStatus = status === 'All' || employee.status === status
    return matchesSearch && matchesDepartment && matchesType && matchesStatus
  })
}

export const getUpcomingJoinings = (employees, count = 4) => {
  return employees
    .filter((employee) => ['Preboarding', 'Onboarding'].includes(employee.lifecycleStage))
    .sort((a, b) => parseDateString(a.joiningDate) - parseDateString(b.joiningDate))
    .slice(0, count)
    .map((employee) => ({
      id: employee.id,
      name: getEmployeeDisplayName(employee),
      designation: employee.designation,
      joiningDate: employee.joiningDate,
      employmentType: employee.employmentType,
      status: employee.status,
    }))
}

export const getLifecycleStats = (employees) => ({
  preboarding: employees.filter((employee) => employee.lifecycleStage === 'Preboarding').length,
  onboarding: employees.filter((employee) => employee.lifecycleStage === 'Onboarding').length,
  active: employees.filter((employee) => employee.lifecycleStage === 'Active').length,
  offboarding: employees.filter((employee) => employee.lifecycleStage === 'Offboarding').length,
  total: employees.length,
})

export const getStatusSummary = (employees, stage) => {
  const filtered = stage ? employees.filter((employee) => employee.lifecycleStage === stage) : employees
  const completed = filtered.filter((employee) => getEmployeeProgress(employee) === 100).length
  const inProgress = filtered.filter((employee) => getEmployeeProgress(employee) > 0 && getEmployeeProgress(employee) < 100).length
  const pending = filtered.filter((employee) => getEmployeeProgress(employee) === 0).length
  return { completed, inProgress, pending }
}

export const getDepartmentTaskData = (employees) => {
  const summary = employees.reduce((acc, employee) => {
    const department = employee.department || 'Unknown'
    acc[department] = (acc[department] || 0) + 1
    return acc
  }, {})

  return Object.entries(summary)
    .map(([department, value]) => ({ department, value, color: departmentColor(department) }))
    .sort((a, b) => b.value - a.value)
}

const departmentColor = (department) => {
  switch (department) {
    case 'Engineering':
      return '#1A73E8'
    case 'Marketing':
      return '#5F6368'
    case 'Design':
      return '#188038'
    case 'Finance':
      return '#F9AB00'
    case 'HR':
      return '#D93025'
    case 'Analytics':
      return '#7C4DFF'
    default:
      return '#1A73E8'
  }
}

export const getChecklistProgress = (items = []) => {
  const total = items.length
  const completedCount = items.filter((item) => item.status === 'Completed').length
  const percentage = total ? Math.round((completedCount / total) * 100) : 0
  return { completedCount, total, percentage }
}

export const getEmployeeProgress = (employee) => {

  if (!employee) {
    return 0
  }


  /**
   * Backend preboarding tasks use:
   *
   * task.Status
   *
   * Frontend legacy checklist uses:
   *
   * item.status
   */
  const tasks =
    employee.preboardingTasks || []


  if (tasks.length > 0) {

    const completed =
      tasks.filter(
        (task) =>
          String(
            task.Status ||
            task.status ||
            ''
          )
            .trim()
            .toLowerCase() ===
          'completed'
      ).length


    return Math.round(
      (
        completed /
        tasks.length
      ) * 100
    )
  }


  /**
   * Keep compatibility with the older
   * frontend checklist structure.
   */
  if (
    employee.preboardingChecklist?.length
  ) {
    return getChecklistProgress(
      employee.preboardingChecklist
    ).percentage
  }


  if (
    employee.onboardingChecklist?.length
  ) {
    return getChecklistProgress(
      employee.onboardingChecklist
    ).percentage
  }


  /**
   * Final fallback to backend progress.
   */
  const progress =
    Number(
      employee.progress
    )


  return Number.isFinite(progress)
    ? Math.max(
        0,
        Math.min(
          100,
          progress
        )
      )
    : 0
}

export const reconcilePreboardingChecklist = ({ employmentType, seniorPosition, joiningDate, existingChecklist = [], creationTimestamp = null }) => {
  const makeDisplayDate = (d) => {
    if (!d) return ''
    const iso = formatDateISO(d)
    return formatDateDisplay(iso)
  }

  const makeISODate = (d) => {
    if (!d) return ''
    return formatDateISO(d)
  }

  const defaultStakeholderISO = joiningDate ? formatDateISO(addDays(formatDateISO(joiningDate), -3)) : ''
  const defaultStakeholderDue = defaultStakeholderISO ? formatDateDisplay(defaultStakeholderISO) : ''

  const templatesFull = [
    { id: 'candidate-acceptance', task: 'Candidate Acceptance', description: 'Candidate acceptance.' },
    { id: 'hr-team-notification', task: 'HR Team Notification', description: 'Notify HR team.' },
    { id: 'stakeholder-notification', task: 'Stakeholder Notification', description: 'Notify internal team.' , dueDate: defaultStakeholderDue, scheduleMode: 'automatic', scheduledDate: defaultStakeholderISO, scheduledTime: '09:00', recipients: stakeholderRecipients },
    { id: 'user-email-creation', task: 'User Email ID Creation', description: 'Create workspace email account.' },
    { id: 'welcome-email', task: 'Welcome Aboard Email', description: 'Send welcome email.' },
    { id: 'calendar-invite', task: 'Calendar Invite', description: 'Schedule orientation.' },
    { id: 'buddy-assigned', task: 'Buddy Assigned', description: 'Assign a buddy.' },
    { id: 'documentation-process', task: 'Documentation Process', description: 'Collect required documents.' },
  ]

  const templatesIntern = [
    { id: 'candidate-acceptance', task: 'Candidate Acceptance', description: 'Candidate acceptance.' },
    { id: 'hr-team-notification', task: 'HR Team Notification', description: 'Notify HR team.' },
    { id: 'stakeholder-notification', task: 'Stakeholder Notification', description: 'Notify internal team.' , dueDate: defaultStakeholderDue, scheduleMode: 'automatic', scheduledDate: defaultStakeholderISO, scheduledTime: '09:00', recipients: stakeholderRecipients },
    { id: 'user-email-creation-request', task: 'User Email ID Creation Request', description: 'Request Workspace account for candidate.' },
    { id: 'workspace-email-creation', task: 'Workspace Email ID Creation', description: 'Create Workspace account and grant access.' },
    { id: 'calendar-invite', task: 'Calendar Invite', description: 'Schedule orientation.' },
    { id: 'buddy-assigned', task: 'Buddy Assigned', description: 'Assign a buddy.' },
    { id: 'documentation-process', task: 'Documentation Process', description: 'Collect required documents.' },
  ]

  const base = employmentType === 'Intern' ? templatesIntern : templatesFull

  // Insert Director's Email for full-time senior
  let final = [...base]
  if (employmentType !== 'Intern' && seniorPosition) {
    // put director-email after welcome-email
    const idx = final.findIndex((t) => t.id === 'welcome-email')
    const director = { id: 'director-email', task: "Director's Email", description: "Send director's email (senior hires)." }
    if (idx >= 0) {
      final.splice(idx + 1, 0, director)
    } else {
      final.push(director)
    }
  }

  // Reconcile with existing checklist: preserve status, dueDate (unless default and existing differs?), notes, assignedTo
  const existingMap = (existingChecklist || []).reduce((acc, it) => { acc[it.id] = it; return acc }, {})

  const result = final.map((t) => {
    const ex = existingMap[t.id]
    const due = (t.id === 'stakeholder-notification') ? (ex?.dueDate || t.dueDate || '') : (ex?.dueDate || '')
    return {
      id: t.id,
      task: t.task,
      description: t.description,
      // If this is a fresh checklist (no existing items) and this is candidate-acceptance,
      // mark it completed with creation timestamp.
      status: (Object.keys(existingMap).length === 0 && t.id === 'candidate-acceptance') ? 'Completed' : (ex?.status || 'Pending'),
      dueDate: due,
      notes: ex?.notes || '',
      assignedTo: ex?.assignedTo || '',
      // preserve completedAt, or set from creation timestamp for new checklist candidate-acceptance
      completedAt: (Object.keys(existingMap).length === 0 && t.id === 'candidate-acceptance') ? (creationTimestamp || new Date().toISOString()) : (ex?.completedAt ?? null),
      // Stakeholder scheduling fields
      scheduleMode: ex?.scheduleMode || (t.id === 'stakeholder-notification' ? t.scheduleMode : undefined),
      scheduledDate: ex?.scheduledDate || (t.id === 'stakeholder-notification' ? t.scheduledDate : undefined),
      scheduledTime: ex?.scheduledTime || (t.id === 'stakeholder-notification' ? t.scheduledTime : undefined),
      recipients: ex?.recipients || (t.id === 'stakeholder-notification' ? t.recipients : undefined),
      updatedAt: ex?.updatedAt || null,
      updatedBy: ex?.updatedBy || null,
    }
  })

  return result
}
