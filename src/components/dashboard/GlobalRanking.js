import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_GLOBAL_RANKING } from '../../graphql/queries';
import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Tooltip,
  Paper,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
} from '@mui/icons-material';

const getRankColor = (rank) => {
  switch (rank) {
    case 1:
      return '#FFD700'; // Ouro
    case 2:
      return '#C0C0C0'; // Prata
    case 3:
      return '#CD7F32'; // Bronze
    default:
      return '#2196F3'; // Azul padrão
  }
};

const GlobalRanking = () => {
  const { loading, error, data } = useQuery(GET_GLOBAL_RANKING);

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>Erro ao carregar ranking</Typography>;

  const rankings = data.getGlobalRanking;

  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEvents sx={{ fontSize: 32, color: '#FFD700', mr: 1 }} />
          <Typography variant="h5" className="dashboard-title">
            Ranking Global
          </Typography>
        </Box>

        <Paper elevation={0} sx={{ maxHeight: 400, overflow: 'auto' }}>
          <List>
            {rankings.map((ranking) => (
              <ListItem
                key={ranking.user._id}
                className="ranking-item"
                sx={{
                  backgroundColor: ranking.rank <= 3 ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                }}
              >
                <ListItemAvatar>
                  <Tooltip title={`Posição #${ranking.rank}`}>
                    <Avatar
                      src={ranking.user.avatar}
                      className={`ranking-avatar ${ranking.rank <= 3 ? 'top-3' : ''}`}
                      sx={{
                        borderColor: getRankColor(ranking.rank),
                      }}
                    >
                      {ranking.rank <= 3 ? (
                        ranking.rank === 1 ? (
                          <EmojiEvents sx={{ color: getRankColor(ranking.rank) }} />
                        ) : ranking.rank === 2 ? (
                          <Star sx={{ color: getRankColor(ranking.rank) }} />
                        ) : (
                          <TrendingUp sx={{ color: getRankColor(ranking.rank) }} />
                        )
                      ) : (
                        ranking.rank
                      )}
                    </Avatar>
                  </Tooltip>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" className="ranking-username">
                      {ranking.user.username}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" className="ranking-points">
                      {ranking.points} pontos
                    </Typography>
                  }
                />
                <Typography variant="h6" className="ranking-position" sx={{ color: getRankColor(ranking.rank) }}>
                  #{ranking.rank}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default GlobalRanking; 