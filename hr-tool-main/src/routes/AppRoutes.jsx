import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard/Dashboard'
import Preboarding from '../pages/Preboarding/Preboarding'
import PreboardingProfile from '../pages/Preboarding/PreboardingProfile'
import Onboarding from '../pages/Onboarding/Onboarding'
import Employees from '../pages/Employees/Employees'
import EmployeeProfile from '../pages/Employees/EmployeeProfile'
import TeamIntroduction from '../pages/TeamIntroduction/TeamIntroduction'
import Offboarding from '../pages/Offboarding/Offboarding'
import Reports from '../pages/Reports/Reports'
import EmailTemplates from '../pages/EmailTemplates/EmailTemplates'
import Settings from '../pages/Settings/Settings'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/preboarding" element={<Preboarding />} />
        <Route path="/preboarding/:employeeId" element={<PreboardingProfile />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:employeeId" element={<EmployeeProfile />} />
        <Route path="/team-introduction" element={<TeamIntroduction />} />
        <Route path="/offboarding" element={<Offboarding />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/email-templates" element={<EmailTemplates />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
