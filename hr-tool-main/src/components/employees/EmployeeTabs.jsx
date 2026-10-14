import { Box, Tab, Tabs } from '@mui/material'

function EmployeeTabs({ value, onChange, tabs }) {
  return (
    <Box sx={{ borderBottom: '1px solid #DADCE0' }}>
      <Tabs value={value} onChange={onChange} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab) => (
          <Tab key={tab} value={tab} label={tab} />
        ))}
      </Tabs>
    </Box>
  )
}

export default EmployeeTabs
