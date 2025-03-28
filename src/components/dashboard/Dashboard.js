import React from 'react';
import { Grid, Container, Box } from '@mui/material';
import UserStatsDashboard from './UserStatsDashboard';
import GlobalRanking from './GlobalRanking';
import PhaseRanking from './PhaseRanking';
import ProgressReport from './ProgressReport';
import '../../styles/dashboard.css';

const Dashboard = () => {
  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Grid container spacing={3}>
        {/* Estatísticas do Usuário */}
        <Grid item xs={12}>
          <UserStatsDashboard />
        </Grid>

        {/* Rankings */}
        <Grid item xs={12} md={6}>
          <GlobalRanking />
        </Grid>
        <Grid item xs={12} md={6}>
          <PhaseRanking />
        </Grid>

        {/* Relatório de Progresso */}
        <Grid item xs={12}>
          <ProgressReport />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 