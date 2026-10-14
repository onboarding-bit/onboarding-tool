import { Box, Typography } from '@mui/material'

function PageContainer({ title, description, children }) {
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: '#5F6368' }}>
          {description}
        </Typography>
      </Box>

      {children}
    </Box>
  )
}

export default PageContainer
