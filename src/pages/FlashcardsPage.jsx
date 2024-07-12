import React, { useState } from 'react';
import { Typography, IconButton, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import styled, { css } from 'styled-components';
import Header from '../components/Header';
import flashcardData from '../mocks/flashcardData';

const FlashcardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;
`;

const StyledCard = styled.div`
  width: 90%;
  max-width: 1000px;
  height: 400px; /* Defina a altura fixa aqui */
  margin: 2rem 0;
  position: relative;
  perspective: 1000px;

  .inner-card {
    width: 100%;
    height: 100%;
    position: absolute;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    ${props => props.flipped ? css`transform: rotateY(180deg);` : css`transform: rotateY(0deg);`}
  }

  .front, .back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    background-color: #5650F5;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .back {
    transform: rotateY(180deg);
  }
`;

const TopSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
`;

const MiddleSection = styled.div`
  flex: 8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 2rem;
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IncorrectButton = styled(Button)`
  width: 50%;
  background-color: #FFCEC6 !important;
  color: #E41315 !important;
  &:hover {
    background-color: #FFB3A9 !important;
  }
`;

const CorrectButton = styled(Button)`
  width: 50%;
  background-color: #DEEF9C !important;
  color: #7AA211 !important;
  &:hover {
    background-color: #CFEA70 !important; 
  }
`;

const ProgressDots = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;

  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin: 0 5px;
    background-color: #dddddd;
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

const FlashcardsPage = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(flashcardData.cards.map(() => ({ status: 'pending' }))); // pending, correct, incorrect

  const handleFlip = () => setFlipped(!flipped);

  const handleMarkCorrect = () => {
    const newProgress = [...progress];
    newProgress[currentCardIndex].status = 'correct';
    setProgress(newProgress);
    handleNext();
  };

  const handleMarkIncorrect = () => {
    const newProgress = [...progress];
    newProgress[currentCardIndex].status = 'incorrect';
    setProgress(newProgress);
    handleNext();
  };

  const handleNext = () => {
    if (currentCardIndex < flashcardData.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    setFlipped(false);
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
    setFlipped(false);
  };

  const handleDotClick = (index) => {
    setCurrentCardIndex(index);
    setFlipped(false);
  };

  const currentCard = flashcardData.cards[currentCardIndex];

  return (
    <FlashcardsContainer>
      <Header />
      <StyledCard flipped={flipped}>
        <div className="inner-card">
          <div className="front">
            <TopSection>
              <IconButton onClick={handleFlip} style={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </TopSection>
            <MiddleSection>
              <Typography variant="h5">{currentCard.question}</Typography>
            </MiddleSection>
          </div>
          <div className="back">
            <TopSection>
              <IconButton onClick={handleFlip} style={{ color: 'white' }}>
                <RefreshIcon />
              </IconButton>
            </TopSection>
            <MiddleSection>
              <Typography variant="h5">{currentCard.answer}</Typography>
            </MiddleSection>
            <BottomSection>
              <IncorrectButton onClick={handleMarkIncorrect} variant="contained">
                Incorreto
              </IncorrectButton>
              <CorrectButton onClick={handleMarkCorrect} variant="contained">
                Correto
              </CorrectButton>
            </BottomSection>
          </div>
        </div>
      </StyledCard>
      <ProgressDots>
        {progress.map((p, index) => (
          <div
            key={index}
            className={`dot ${p.status} ${index === currentCardIndex ? 'current' : ''}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </ProgressDots>
    </FlashcardsContainer>
  );
};

export default FlashcardsPage;
