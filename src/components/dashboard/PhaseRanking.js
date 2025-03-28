import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PHASE_RANKING } from '../../graphql/queries';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  EmojiEvents,
  Star,
  TrendingUp,
  School,
} from '@mui/icons-material';

const phases = [
  { value: 'phase1', label: 'Fase 1 - Fundamentos' },
  { value: 'phase2', label: 'Fase 2 - Intermediário' },
  { value: 'phase3', label: 'Fase 3 - Avançado' },
  { value: 'phase4', label: 'Fase 4 - Especialização' },
  { value: 'phase5', label: 'Fase 5 - Mastery' },
];

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

const PhaseRanking = () => {
  const [selectedPhase, setSelectedPhase] = useState(phases[0].value);

  const { loading, error, data } = useQuery(GET_PHASE_RANKING, {
    variables: { phase: selectedPhase },
  });

  if (loading) return <Typography>Carregando...</Typography>;
  if (error) return <Typography>Erro ao carregar ranking</Typography>;

  const rankings = data.getPhaseRanking;
  const currentPhase = phases.find(phase => phase.value === selectedPhase);

  return (
    <Card className="dashboard-card">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <School sx={{ fontSize: 32, color: '#2196F3', mr: 1 }} />
          <Typography variant="h5" className="dashboard-title">
            Ranking por Fase
          </Typography>
        </Box>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Selecione a Fase</InputLabel>
          <Select
            value={selectedPhase}
            label="Selecione a Fase"
            onChange={(e) => setSelectedPhase(e.target.value)}
          >
            {phases.map((phase) => (
              <MenuItem key={phase.value} value={phase.value}>
                {phase.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
          {currentPhase.label}
        </Typography>

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

export default PhaseRanking; 