import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PROGRESS_REPORT } from '../../graphql/queries';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
} from '@mui/material';
import {
  School,
  Star,
  Timer,
  TrendingUp,
  Refresh,
  Assessment,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const ProgressReport = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const { loading, error, data, refetch } = useQuery(GET_PROGRESS_REPORT, {
    variables: {
      input: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    },
  });

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>Erro ao carregar relatório</Typography>;

  const analytics = data.getProgressReport.analytics;

  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Assessment sx={{ fontSize: 32, color: '#2196F3', mr: 1 }} />
          <Typography variant="h5" className="dashboard-title">
            Relatório de Progresso
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            sx={{ alignSelf: 'flex-end' }}
          >
            Atualizar
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Decks Completados */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <School sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                <Typography variant="h4" className="stats-value">
                  {analytics.totalDecksCompleted}
                </Typography>
                <Typography variant="body2" className="stats-label">
                  Decks Completados
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(analytics.totalDecksCompleted / 100) * 100}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Quizzes Realizados */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Star sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                <Typography variant="h4" className="stats-value">
                  {analytics.totalQuizzesTaken}
                </Typography>
                <Typography variant="body2" className="stats-label">
                  Quizzes Realizados
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(analytics.totalQuizzesTaken / 50) * 100}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Tempo de Estudo */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <Timer sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                <Typography variant="h4" className="stats-value">
                  {formatTime(analytics.totalStudyTime)}
                </Typography>
                <Typography variant="body2" className="stats-label">
                  Tempo de Estudo
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(analytics.totalStudyTime / 1000) * 100}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Pontuação Média */}
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stats-card">
              <CardContent>
                <TrendingUp sx={{ fontSize: 40, color: '#F44336', mb: 1 }} />
                <Typography variant="h4" className="stats-value">
                  {analytics.averageScore.toFixed(1)}%
                </Typography>
                <Typography variant="body2" className="stats-label">
                  Pontuação Média
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={analytics.averageScore}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabela de Progresso por Fase */}
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fase</TableCell>
                <TableCell align="right">Pontuação</TableCell>
                <TableCell align="right">Tempo de Estudo</TableCell>
                <TableCell align="right">Taxa de Conclusão</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {analytics.scoresByPhase.map((score, index) => {
                const studyTime = analytics.studyTimeByPhase[index];
                const completionRate = analytics.completionRateByPhase[index];
                return (
                  <TableRow key={score.phase} hover>
                    <TableCell component="th" scope="row">
                      Fase {score.phase}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={`${score.value}% de acerto`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Star sx={{ fontSize: 16, color: '#FFD700' }} />
                          {score.value}%
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={formatTime(studyTime.value)}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <Timer sx={{ fontSize: 16, color: '#FF9800' }} />
                          {formatTime(studyTime.value)}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={`${completionRate.value}% de conclusão`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                          <School sx={{ fontSize: 16, color: '#4CAF50' }} />
                          {completionRate.value}%
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ProgressReport; 