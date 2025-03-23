import styled, { keyframes } from 'styled-components';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Box, Chip } from '@mui/material';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const QuizWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 2rem;
  padding-top: 100px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const QuestionCard = styled.div`
  background: linear-gradient(135deg, #5650F5 0%, #7B6CF6 100%);
  color: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  min-height: 600px;
  max-height: 80vh;
  margin: 1rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shine} 3s infinite;
  }
`;

export const OptionButton = styled(Button)`
  width: 100%;
  margin: 0.5rem 0;
  background-color: ${props =>
    props.disabled ? '#D3D3D3' :
    props.selected ? '#ADD8E6' :
    props.correct ? '#DEEF9C' :
    props.incorrect ? '#FFCEC6' : 'rgba(255,255,255,0.9)'} !important;
  color: ${props =>
    props.disabled ? '#A9A9A9' :
    props.selected ? '#000' :
    props.correct ? '#7AA211' :
    props.incorrect ? '#E41315' : '#000'} !important;
  transition: all 0.3s ease;
  border-radius: 1rem !important;
  padding: 1rem !important;
  font-size: 1.1rem !important;
  text-transform: none !important;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
  white-space: normal !important;
  height: auto !important;
  min-height: 60px !important;
  line-height: 1.4 !important;
  text-align: left !important;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
    background-color: ${props =>
      props.disabled ? '#D3D3D3' :
      props.selected ? '#ADD8E6' :
      props.correct ? '#CFEA70' :
      props.incorrect ? '#FFB3A9' : '#ffffff'} !important;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;

  .dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #ddd;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    animation: ${fadeIn} 0.3s ease-out;

    &.correct {
      background-color: #7AA211;
      animation: ${pulse} 0.5s ease-out;
    }
    &.incorrect {
      background-color: #E41315;
      animation: ${pulse} 0.5s ease-out;
    }
    &.pending {
      background-color: #ddd;
    }
    &.current {
      background-color: #5650F5;
      animation: ${bounce} 1s infinite;
      box-shadow: 0 0 10px rgba(86, 80, 245, 0.5);
    }

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const ButtonWrapper = styled(Box)`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const OptionsWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  animation: ${fadeIn} 0.5s ease-out;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const TimerContainer = styled.div`
  position: fixed;
  right: 2rem;
  top: 120px;
  background: linear-gradient(135deg, #5650F5 0%, #7B6CF6 100%);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  color: white;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
  z-index: 1000;
  position: relative;
  overflow: hidden;
  min-width: 120px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    animation: ${shine} 3s infinite;
  }

  .time {
    font-size: 2.5rem;
    font-weight: bold;
    font-family: 'Rowdies', cursive;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .label {
    font-size: 1rem;
    opacity: 0.9;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  @media (max-width: 768px) {
    right: 1rem;
    top: 100px;
    padding: 1rem;
    min-width: 100px;

    .time {
      font-size: 2rem;
    }

    .label {
      font-size: 0.9rem;
    }
  }
`;

export const ActionButton = styled(Button)`
  background: linear-gradient(135deg, ${props => props.variant === 'clear' ? '#FF6B6B' : '#4CAF50'} 0%, ${props => props.variant === 'clear' ? '#FF8E8E' : '#45a049'} 100%) !important;
  color: white !important;
  padding: 1rem 2rem !important;
  border-radius: 1rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  font-size: 1.1rem !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  .MuiButton-startIcon {
    margin-right: 8px;
  }
`;

export const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  animation: ${fadeIn} 0.5s ease-out;
  margin-top: 1rem;
`;

export const QuestionBadge = styled(Chip)`
  background: rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  font-weight: bold !important;
  padding: 0.5rem 1rem !important;
  margin-bottom: 1rem !important;
  border-radius: 1rem !important;
  animation: ${fadeIn} 0.5s ease-out;
`;

export const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: linear-gradient(135deg, #5650F5 0%, #7B6CF6 100%);
    color: white;
    border-radius: 1.5rem;
    padding: 2rem;
    animation: ${fadeIn} 0.3s ease-out;
  }
`;

export const StyledDialogTitle = styled(DialogTitle)`
  color: white !important;
  text-align: center !important;
  font-weight: bold !important;
  font-size: 1.5rem !important;
`;

export const StyledDialogContent = styled(DialogContent)`
  color: white !important;
  text-align: center !important;
  font-size: 1.1rem !important;
  line-height: 1.6 !important;
`;

export const StyledDialogActions = styled(DialogActions)`
  justify-content: center !important;
  padding: 1rem 0 0 0 !important;
`;

export const NextQuestionButton = styled(Button)`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%) !important;
  color: white !important;
  padding: 1rem 2rem !important;
  border-radius: 1rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  font-size: 1.1rem !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
  }

  &:active {
    transform: translateY(0);
  }
`;

export const NavigationButton = styled(Button)`
  background: linear-gradient(135deg, #5650F5 0%, #7B6CF6 100%) !important;
  color: white !important;
  padding: 0.8rem 1.5rem !important;
  border-radius: 1rem !important;
  font-weight: bold !important;
  text-transform: none !important;
  font-size: 1rem !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #e0e0e0 !important;
    color: #9e9e9e !important;
    box-shadow: none !important;
    transform: none !important;
  }
`;