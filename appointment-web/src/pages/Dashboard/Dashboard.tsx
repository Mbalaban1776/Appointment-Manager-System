import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useAuthStore } from '../../services/auth/authStore';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.firstName}!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Upcoming Appointments
            </Typography>
            <Typography component="p" variant="h4">
              5
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
              Today
            </Typography>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Clients
            </Typography>
            <Typography component="p" variant="h4">
              128
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 140 }}>
             <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Revenue (Month)
            </Typography>
            <Typography component="p" variant="h4">
              $3,400
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
