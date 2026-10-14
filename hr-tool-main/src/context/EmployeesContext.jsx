import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  getEmployeesWithPreboardingData,
  getPreboardingTasks,
} from '../services/api'

const EmployeesContext =
  createContext(null)

export function EmployeesProvider({ children }) {
  const [employees, setEmployees] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  /**
   * ==========================================================
   * LOAD EMPLOYEES FROM APPS SCRIPT
   * ==========================================================
   */
  const loadEmployees =
  async () => {

    try {

      setLoading(true)
      setError('')


      const backendEmployees =
        await getEmployeesWithPreboardingData()


      const employeesWithTasks =
        backendEmployees.map(
          (employee) => {

            const tasks =
              employee.preboardingTasks || []


            return {
              ...employee,

              id:
                employee.Internal_ID,

              internalId:
                employee.Internal_ID,

              employeeId:
                employee.Employee_ID,

              firstName:
                employee.First_Name,

              lastName:
                employee.Last_Name,

              personalEmail:
                employee.Personal_Email,

              workEmail:
                employee.Work_Email,

              phone:
                employee.Phone,

              designation:
                employee.Designation,

              department:
                employee.Department,

              employmentType:
                employee.Employment_Type,

              joiningDate:
                employee.Joining_Date,

              reportingManager:
                employee.Reporting_Manager,

              workLocation:
                employee.Work_Location,

              seniorPosition:
                employee.Senior_Position,

              immediateJoining:
                employee.Immediate_Joining,

              lifecycleStage:
                employee.Lifecycle_Stage,

              lifecycleStatus:
                employee.Lifecycle_Status,

              /**
               * Important:
               * Normalize the frontend status.
               */
              status:
                employee.Lifecycle_Status ||
                'In Progress',

              preboardingTasks:
                tasks,

              progress:
                Number(
                  employee.progress || 0
                ),

              completedTasks:
                Number(
                  employee.completedTasks || 0
                ),

              totalTasks:
                Number(
                  employee.totalTasks || 0
                ),
            }
          }
        )


      setEmployees(
        employeesWithTasks
      )

    } catch (loadError) {

      console.error(
        'Failed to load employees:',
        loadError,
      )

      setError(
        loadError?.message ||
        'Failed to load employees.'
      )

    } finally {

      setLoading(false)

    }

  }

  /**
   * ==========================================================
   * INITIAL LOAD
   * ==========================================================
   */
  useEffect(() => {
    loadEmployees()
  }, [])


  /**
   * ==========================================================
   * REFRESH
   * ==========================================================
   *
   * Used after:
   *
   * - task completion
   * - employee creation
   * - calendar creation
   * - email automation
   */
  const refreshEmployees =
    async () => {
      await loadEmployees()
    }


  /**
   * ==========================================================
   * GET ONE EMPLOYEE'S TASKS
   * ==========================================================
   */
  const loadEmployeeTasks =
  async (internalId) => {

    if (!internalId) {
      throw new Error(
        'Internal_ID is required.'
      )
    }


    const tasks =
      await getPreboardingTasks(
        internalId,
      )


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


    const total =
      tasks.length


    const progress =
      total
        ? Math.round(
            (
              completed /
              total
            ) * 100
          )
        : 0


    setEmployees(
      (current) =>
        current.map(
          (employee) =>
            employee.Internal_ID ===
            internalId
              ? {
                  ...employee,

                  preboardingTasks:
                    tasks,

                  progress,

                  completedTasks:
                    completed,

                  totalTasks:
                    total,
                }
              : employee,
        ),
    )


    return {
      tasks,

      progress: {
        percentage:
          progress,

        completed,

        total,
      },
    }
  }


  /**
   * ==========================================================
   * CREATE EMPLOYEE
   * ==========================================================
   *
   * Employee creation itself belongs to the
   * backend.
   *
   * We will connect AddCandidateDialog to this
   * later.
   */
  const addEmployee =
    async (employee) => {
      const {
        createEmployee,
        createPreboardingTasks,
      } =
        await import(
          '../services/api'
        )

      const createdEmployee =
        await createEmployee(
          employee,
        )

      /**
       * Create the checklist immediately.
       */
      const tasks =
        await createPreboardingTasks(
          createdEmployee.Internal_ID,
        )

      const progress =
        await getPreboardingProgress(
          createdEmployee.Internal_ID,
        )

      const mappedEmployee = {
        ...createdEmployee,

        id: createdEmployee.Internal_ID,
        internalId: createdEmployee.Internal_ID,

        employeeId: createdEmployee.Employee_ID,
        firstName: createdEmployee.First_Name,
        lastName: createdEmployee.Last_Name,

        personalEmail: createdEmployee.Personal_Email,
        workEmail: createdEmployee.Work_Email,
        phone: createdEmployee.Phone,

        designation: createdEmployee.Designation,
        department: createdEmployee.Department,
        employmentType: createdEmployee.Employment_Type,
        joiningDate: createdEmployee.Joining_Date,

        reportingManager:
          createdEmployee.Reporting_Manager,

        workLocation:
          createdEmployee.Work_Location,

        seniorPosition:
          createdEmployee.Senior_Position,

        immediateJoining:
          createdEmployee.Immediate_Joining,

        lifecycleStage:
          createdEmployee.Lifecycle_Stage,

        lifecycleStatus:
          createdEmployee.Lifecycle_Status,

        status:
          createdEmployee.Lifecycle_Status || 'In Progress',

        preboardingTasks:
          tasks || [],

        progress:
          progress?.percentage || 0,

        completedTasks:
          progress?.completed || 0,

        totalTasks:
          progress?.total || 0,
      }

      setEmployees(
        (current) => [
          mappedEmployee,
          ...current,
        ],
      )

      return mappedEmployee
    }


  /**
   * ==========================================================
   * UPDATE EMPLOYEE
   * ==========================================================
   */
  const updateEmployee =
    async (
      internalId,
      updates,
    ) => {
      const {
        updateEmployee:
          updateEmployeeApi,
      } =
        await import(
          '../services/api'
        )

      const updated =
        await updateEmployeeApi(
          internalId,
          updates,
        )

      setEmployees(
        (current) =>
          current.map(
            (employee) =>
              employee.Internal_ID ===
                internalId
                ? {
                    ...employee,
                    ...updated,

                    internalId:
                      updated.Internal_ID,

                    employeeId:
                      updated.Employee_ID,

                    firstName:
                      updated.First_Name,

                    lastName:
                      updated.Last_Name,

                    personalEmail:
                      updated.Personal_Email,

                    workEmail:
                      updated.Work_Email,

                    designation:
                      updated.Designation,

                    department:
                      updated.Department,

                    employmentType:
                      updated.Employment_Type,

                    joiningDate:
                      updated.Joining_Date,

                    lifecycleStage:
                      updated.Lifecycle_Stage,

                    lifecycleStatus:
                      updated.Lifecycle_Status,
                  }
                : employee,
          ),
      )

      return updated
    }


  /**
   * ==========================================================
   * VALUE
   * ==========================================================
   */
  const value =
    useMemo(
      () => ({
        employees,

        setEmployees,

        loading,

        error,

        refreshEmployees,

        loadEmployeeTasks,

        addEmployee,

        updateEmployee,
      }),
      [
        employees,
        loading,
        error,
      ],
    )


  return (
    <EmployeesContext.Provider
      value={value}
    >
      {children}
    </EmployeesContext.Provider>
  )
}


export function useEmployeesContext() {
  const context =
    useContext(
      EmployeesContext,
    )

  if (!context) {
    throw new Error(
      'useEmployeesContext must be used within EmployeesProvider',
    )
  }

  return context
}