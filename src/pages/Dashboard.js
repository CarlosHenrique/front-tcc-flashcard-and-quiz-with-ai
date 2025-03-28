import React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import UserStatsDashboard from '../components/dashboard/UserStatsDashboard';
import GlobalRanking from '../components/dashboard/GlobalRanking';
import PhaseRanking from '../components/dashboard/PhaseRanking';
import ProgressReport from '../components/dashboard/ProgressReport';

const Dashboard = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          {/* Estatísticas do usuário */}
          <Grid item xs={12}>
            <UserStatsDashboard />
          </Grid>

          {/* Relatório de Progresso */}
          <Grid item xs={12}>
            <ProgressReport />
          </Grid>

          {/* Rankings */}
          <Grid item xs={12} md={6}>
            <GlobalRanking />
          </Grid>
          <Grid item xs={12} md={6}>
            <PhaseRanking />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 