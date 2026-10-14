import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A73E8',
      dark: '#1557B0',
      light: '#E8F0FE',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#5F6368',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#202124',
      secondary: '#5F6368',
      disabled: '#9AA0A6',
    },
    success: {
      main: '#188038',
    },
    warning: {
      main: '#F9AB00',
    },
    error: {
      main: '#D93025',
    },
    info: {
      main: '#1A73E8',
    },
    divider: '#DADCE0',
  },
  typography: {
    fontFamily: 'Roboto, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      lineHeight: 1.2,
      color: '#202124',
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#202124',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.3,
      color: '#202124',
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
      color: '#202124',
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#202124',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#202124',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#202124',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#5F6368',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#5F6368',
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: '#F8F9FA',
        },
        body: {
          margin: 0,
          backgroundColor: '#F8F9FA',
          color: '#202124',
        },
        '#root': {
          minHeight: '100vh',
        },
        a: {
          color: 'inherit',
          textDecoration: 'none',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 16px',
          fontWeight: 600,
          lineHeight: 1.4,
          minHeight: 40,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: '#1A73E8',
          '&:hover': {
            backgroundColor: '#1557B0',
          },
        },
        outlined: {
          borderColor: '#DADCE0',
          color: '#202124',
          '&:hover': {
            borderColor: '#DADCE0',
            backgroundColor: '#F8F9FA',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #DADCE0',
          borderRadius: 16,
          boxShadow: '0 1px 2px rgba(60, 64, 67, 0.08)',
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            '& fieldset': {
              borderColor: '#DADCE0',
            },
            '&:hover fieldset': {
              borderColor: '#1A73E8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1A73E8',
              borderWidth: 1,
            },
          },
          '& .MuiInputLabel-root': {
            color: '#5F6368',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
          fontSize: '0.75rem',
          lineHeight: 1.4,
        },
        filledPrimary: {
          backgroundColor: '#E8F0FE',
          color: '#1A73E8',
        },
        filledSuccess: {
          backgroundColor: '#E6F4EA',
          color: '#188038',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#5F6368',
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          backgroundColor: '#F8F9FA',
        },
        body: {
          fontSize: '0.875rem',
          color: '#202124',
          borderBottom: '1px solid #DADCE0',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid #DADCE0',
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#202124',
          borderBottom: '1px solid #DADCE0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #DADCE0',
          boxSizing: 'border-box',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 0',
          '&.Mui-selected': {
            backgroundColor: '#E8F0FE',
            color: '#1A73E8',
            '& .MuiListItemIcon-root': {
              color: '#1A73E8',
            },
            '& .MuiListItemText-primary': {
              color: '#1A73E8',
              fontWeight: 600,
            },
          },
        },
      },
    },
  },
})

export default theme
