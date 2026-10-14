import { Card, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'

function RecentActivities({ items }) {
  return (
    <Card sx={{ p: 2.5, border: '1px solid #DADCE0', boxShadow: '0 1px 2px rgba(60,64,67,0.08)' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Recent Activities</Typography>
        <Typography variant="caption" sx={{ color: '#1A73E8', fontWeight: 600 }}>View all</Typography>
      </Stack>

      <List disablePadding>
        {items.map((item) => (
          <ListItem key={`${item.title}-${item.time}`} disableGutters sx={{ py: 1.25, borderBottom: '1px solid #F1F3F4' }}>
            <ListItemText
              primary={item.title}
              secondary={item.detail}
              slotProps={{
                primary: { sx: { fontSize: '0.875rem', fontWeight: 500, color: '#202124' } },
                secondary: { sx: { fontSize: '0.75rem', color: '#5F6368', mt: 0.25 } },
              }}
            />
            <Typography variant="caption" sx={{ color: '#5F6368', whiteSpace: 'nowrap' }}>
              {item.time}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Card>
  )
}

export default RecentActivities
