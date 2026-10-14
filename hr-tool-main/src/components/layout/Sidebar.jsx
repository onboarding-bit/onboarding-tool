import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import {
  BarChart,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  Email,
  Groups,
  HowToReg,
  People,
  PersonAdd,
  PersonRemove,
  Settings,
  Workspaces,
} from '@mui/icons-material'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Dashboard },
  { label: 'Preboarding', path: '/preboarding', icon: PersonAdd },
  { label: 'Onboarding', path: '/onboarding', icon: HowToReg },
  { label: 'Employee Directory', path: '/employees', icon: People },
  { label: 'Team Introduction', path: '/team-introduction', icon: Groups },
  { label: 'Offboarding', path: '/offboarding', icon: PersonRemove },
  { label: 'Reports & Analytics', path: '/reports', icon: BarChart },
  { label: 'Email Templates', path: '/email-templates', icon: Email },
  { label: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const drawerWidth = collapsed ? 72 : 240
  const activeRoute = useMemo(() => navItems.find(({ path }) => location.pathname.startsWith(path) || (path === '/employees' && location.pathname.startsWith('/employees'))) ?? navItems[0], [location.pathname])

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #DADCE0',
          overflowX: 'hidden',
          transition: 'width 0.2s ease',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', px: collapsed ? 1 : 2, py: 2, minHeight: 72 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 2, backgroundColor: '#E8F0FE', color: '#1A73E8' }}>
          <Workspaces fontSize="small" />
        </Box>
        {!collapsed && <Typography variant="h6" sx={{ ml: 1.5, fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Employee Lifecycle</Typography>}
      </Box>

      <Divider />

      <List sx={{ px: 1.5, py: 1.5 }}>
        {navItems.map(({ label, path, icon: Icon }) => {
          const isActive = activeRoute.path === path
          return (
            <ListItemButton
              key={path}
              selected={isActive}
              onClick={() => navigate(path)}
              sx={{
                minHeight: 44,
                px: collapsed ? 1 : 1.5,
                justifyContent: collapsed ? 'center' : 'flex-start',
                mb: 0.5,
                backgroundColor: isActive ? '#E8F0FE' : 'transparent',
                color: isActive ? '#1A73E8' : '#202124',
              }}
            >
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: isActive ? '#1A73E8' : '#5F6368', justifyContent: 'center' }}>
                <Icon fontSize="small" />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#1A73E8' : '#202124',
                      },
                    },
                  }}
                />
              )}
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ mt: 'auto', px: 1.5, py: 2, borderTop: '1px solid #DADCE0' }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', px: collapsed ? 0 : 0.5 }}>
          <Avatar sx={{ width: collapsed ? 26 : 32, height: collapsed ? 26 : 32, bgcolor: '#1A73E8' }}>AH</Avatar>
          {!collapsed && (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#202124', lineHeight: 1.2 }}>Anushka HR</Typography>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>HR Manager</Typography>
            </Box>
          )}
        </Stack>

        <IconButton onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} sx={{ width: '100%', mt: 2, border: '1px solid #DADCE0', borderRadius: 2, backgroundColor: '#F8F9FA', '&:hover': { backgroundColor: '#F1F3F4' } }}>
          {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>
    </Drawer>
  )
}

export default Sidebar
