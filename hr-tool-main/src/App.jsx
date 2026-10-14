import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { EmployeesProvider } from './context/EmployeesContext'
import theme from './theme/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <EmployeesProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </EmployeesProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
