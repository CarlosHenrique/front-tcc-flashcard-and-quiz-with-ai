import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_STATS } from '../../graphql/queries';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  School,
  Quiz,
  Timer,
  EmojiEvents,
  Star,
} from '@mui/icons-material';

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const UserStatsDashboard = () => {
  const { loading, error, data } = useQuery(GET_USER_STATS);

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>Erro ao carregar estatísticas</Typography>;

  const stats = data.getUserStats;
  const user = stats.userId;

  return (
    <Card className="dashboard-card">
      <CardContent>
        <Grid container spacing={3}>
          {/* Informações do Usuário */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: 2,
                color: 'white',
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 100,
                  height: 100,
                  border: '4px solid white',
                  mb: 2,
                }}
              />
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="subtitle1">
                {user.email}
              </Typography>
            </Box>
          </Grid>

          {/* Estatísticas */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {/* Decks Completados */}
              <Grid item xs={12} sm={6}>
                <Card className="stats-card">
                  <CardContent>
                    <School sx={{ fontSize: 40, color: '#2196F3', mb: 1 }} />
                    <Typography variant="h4" className="stats-value">
                      {stats.totalDecksCompleted}
                    </Typography>
                    <Typography variant="body2" className="stats-label">
                      Decks Completados
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.totalDecksCompleted / 100) * 100}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Quizzes Realizados */}
              <Grid item xs={12} sm={6}>
                <Card className="stats-card">
                  <CardContent>
                    <Quiz sx={{ fontSize: 40, color: '#4CAF50', mb: 1 }} />
                    <Typography variant="h4" className="stats-value">
                      {stats.totalQuizzesTaken}
                    </Typography>
                    <Typography variant="body2" className="stats-label">
                      Quizzes Realizados
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.totalQuizzesTaken / 50) * 100}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Tempo de Estudo */}
              <Grid item xs={12} sm={6}>
                <Card className="stats-card">
                  <CardContent>
                    <Timer sx={{ fontSize: 40, color: '#FF9800', mb: 1 }} />
                    <Typography variant="h4" className="stats-value">
                      {formatTime(stats.totalStudyTime)}
                    </Typography>
                    <Typography variant="body2" className="stats-label">
                      Tempo de Estudo
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(stats.totalStudyTime / 1000) * 100}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Pontuação Média */}
              <Grid item xs={12} sm={6}>
                <Card className="stats-card">
                  <CardContent>
                    <Star sx={{ fontSize: 40, color: '#F44336', mb: 1 }} />
                    <Typography variant="h4" className="stats-value">
                      {stats.averageScore.toFixed(1)}%
                    </Typography>
                    <Typography variant="body2" className="stats-label">
                      Pontuação Média
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={stats.averageScore}
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Pontos Totais e Ranking */}
              <Grid item xs={12}>
                <Card className="stats-card">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <EmojiEvents sx={{ fontSize: 40, color: '#FFD700', mb: 1 }} />
                        <Typography variant="h4" className="stats-value">
                          {stats.totalPoints}
                        </Typography>
                        <Typography variant="body2" className="stats-label">
                          Pontos Totais
                        </Typography>
                      </Box>
                      <Tooltip title="Sua posição no ranking global">
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h3" color="primary">
                            #{stats.globalRank}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Ranking Global
                          </Typography>
                        </Box>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserStatsDashboard; 