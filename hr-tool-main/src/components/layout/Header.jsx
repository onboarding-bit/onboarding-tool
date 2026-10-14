import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { ArrowDropDown, HelpOutlineOutlined, NotificationsNone, Search } from '@mui/icons-material'

const routeTitles = {
  '/dashboard': 'Dashboard Overview',
  '/preboarding': 'Preboarding',
  '/preboarding/': 'Preboarding',
  '/onboarding': 'Onboarding',
  '/employees': 'Employee Directory',
  '/employees/': 'Employee Directory',
  '/team-introduction': 'Team Introduction',
  '/offboarding': 'Offboarding',
  '/reports': 'Reports & Analytics',
  '/email-templates': 'Email Templates',
  '/settings': 'Settings',
}

function Header() {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState(null)

  let currentPage = routeTitles[location.pathname] ?? 'Dashboard Overview'

  if (!routeTitles[location.pathname]) {
    if (location.pathname.startsWith('/preboarding/')) currentPage = 'Preboarding'
    else if (location.pathname.startsWith('/employees/')) currentPage = 'Employee Directory'
  }
  const open = Boolean(anchorEl)

  return (
    <AppBar position="static" sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #DADCE0', boxShadow: 'none' }}>
      <Toolbar sx={{ minHeight: 76, px: { xs: 2, md: 3 }, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: '#5F6368', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Home / {currentPage}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.25, fontSize: '1.45rem' }}>
            {currentPage}
          </Typography>
        </Box>

        <Box sx={{ flex: 1.2, display: 'flex', justifyContent: 'center', px: 1 }}>
          <TextField
            fullWidth
            placeholder="Search employees, tasks, documents..."
            size="small"
            sx={{ maxWidth: 520 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" sx={{ color: '#5F6368' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <IconButton aria-label="Notifications" size="small" sx={{ border: '1px solid #DADCE0', borderRadius: 2 }}>
            <NotificationsNone fontSize="small" />
          </IconButton>
          <IconButton aria-label="Help" size="small" sx={{ border: '1px solid #DADCE0', borderRadius: 2 }}>
            <HelpOutlineOutlined fontSize="small" />
          </IconButton>

          <Box onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.75, borderRadius: 2, border: '1px solid #DADCE0', backgroundColor: '#F8F9FA', cursor: 'pointer' }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#1A73E8', fontSize: '0.72rem', fontWeight: 700 }}>AH</Avatar>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#202124', lineHeight: 1.2 }}>Anushka HR</Typography>
              <Typography variant="caption" sx={{ color: '#5F6368' }}>HR Manager</Typography>
            </Box>
            <ArrowDropDown fontSize="small" sx={{ color: '#5F6368' }} />
          </Box>
        </Box>
      </Toolbar>

      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Sign out</MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Header
