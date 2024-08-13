import styled from 'styled-components';
import {  Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import {Box, Chip} from '@mui/material';

export const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  padding-top: 100px;
  box-sizing: border-box;
`;

export const QuestionCard = styled.div`
  background-color: #5650F5;
  color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  height: 600px;
  margin: 2rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const OptionButton = styled(Button)`
  width: 100%;
  margin: 0.5rem 0;
  background-color: ${props =>
    props.disabled ? '#D3D3D3' :
    props.selected ? '#ADD8E6' :
    props.correct ? '#DEEF9C' :
    props.incorrect ? '#FFCEC6' : '#f0f0f0'} !important;
  color: ${props =>
    props.disabled ? '#A9A9A9' :
    props.selected ? '#000' :
    props.correct ? '#7AA211' :
    props.incorrect ? '#E41315' : '#000'} !important;
  &:hover {
    background-color: ${props =>
      props.disabled ? '#D3D3D3' :
      props.selected ? '#ADD8E6' :
      props.correct ? '#CFEA70' :
      props.incorrect ? '#FFB3A9' : '#e0e0e0'} !important;
  }
`;

export const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: #ddd;
    &.correct {
      background-color: #7AA211;
    }
    &.incorrect {
      background-color: #E41315;
    }
    &.current {
      border: 2px solid #b4bfff;
    }
  }
`;

export const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
`;

export const OptionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

export const QuestionBadge = styled(Chip)`
  margin-bottom: 0.2rem;
  width: 80%;
  height: 2rem;
  align-self: center;
  background-color: #FFFF !important;
  color: #5650F5 !important;
  font-weight: bold !important;
  font-family: 'Rowdies', cursive !important;
`;

export const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    background-color: #fff;
    padding: 2rem;
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  text-align: center;
  color: #5650F5;
  font-family: 'Rowdies', cursive !important;
`;

export const StyledDialogContent = styled(DialogContent)`
  text-align: center;
`;

export const StyledDialogActions = styled(DialogActions)`
  display: flex;
  justify-content: center;
`;

export const NextQuestionButton = styled(Button)`
  border: 2px solid #5650F5 !important;
  color: #5650F5 !important;
  font-weight: bold !important;
  margin-top: 1rem;
`;
