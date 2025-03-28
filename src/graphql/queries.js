import { gql } from 'graphql-tag';

export const GET_USER_STATS = gql`
  query GetUserStats {
    getUserStats {
      _id
      totalDecksCompleted
      totalQuizzesTaken
      averageScore
      totalStudyTime
      scoresByPhase {
        phase
        value
      }
      studyTimeByPhase {
        phase
        value
      }
      completionRateByPhase {
        phase
        value
      }
      globalRank
      phaseRanks {
        phase
        value
      }
      totalPoints
      lastUpdated
      userId {
        _id
        username
        email
        avatar
      }
    }
  }
`;

export const GET_GLOBAL_RANKING = gql`
  query GetGlobalRanking {
    getGlobalRanking {
      user {
        _id
        username
        email
        avatar
      }
      points
      rank
    }
  }
`;

export const GET_PHASE_RANKING = gql`
  query GetPhaseRanking($phase: String!) {
    getPhaseRanking(phase: $phase) {
      user {
        _id
        username
        email
        avatar
      }
      points
      rank
    }
  }
`;

export const GET_PROGRESS_REPORT = gql`
  query GetProgressReport($input: ProgressReportInput!) {
    getProgressReport(input: $input) {
      analytics {
        _id
        totalDecksCompleted
        totalQuizzesTaken
        averageScore
        totalStudyTime
        scoresByPhase {
          phase
          value
        }
        studyTimeByPhase {
          phase
          value
        }
        completionRateByPhase {
          phase
          value
        }
        globalRank
        phaseRanks {
          phase
          value
        }
        totalPoints
        lastUpdated
        userId {
          _id
          username
          email
          avatar
        }
      }
      startDate
      endDate
    }
  }
`;

export const UPDATE_USER_STATS = gql`
  mutation UpdateUserStats($input: UpdateAnalyticsInput!) {
    updateUserStats(input: $input) {
      _id
      totalDecksCompleted
      totalQuizzesTaken
      averageScore
      totalStudyTime
      scoresByPhase {
        phase
        value
      }
      studyTimeByPhase {
        phase
        value
      }
      completionRateByPhase {
        phase
        value
      }
      globalRank
      phaseRanks {
        phase
        value
      }
      totalPoints
      lastUpdated
      userId {
        _id
        username
        email
        avatar
      }
    }
  }
`;

export const UPDATE_GLOBAL_RANKINGS = gql`
  mutation UpdateGlobalRankings {
    updateGlobalRankings
  }
`;

export const UPDATE_PHASE_RANKINGS = gql`
  mutation UpdatePhaseRankings($phase: String!) {
    updatePhaseRankings(phase: $phase)
  }
`; 