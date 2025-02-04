import React, { useState } from 'react';
import { Typography, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Refresh as RefreshIcon, ArrowBack, ArrowForward, Info as InfoIcon } from '@mui/icons-material';
import styled, { css } from 'styled-components';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useFlashcards } from '../context/FlashcardsContext';
import PracticeResultModal  from '../components/PracticeResult'


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
  height: 400px;
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
  justify-content: space-between;
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

const NavigationButton = styled(Button)`
  margin: 1rem;
  background-color: #5650F5 !important;
`;

const NavigationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 70%;
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

const SubmitButton = styled(Button)`
  background-color: #5650F5 !important;
  color: white !important;
  margin-top: 1em;
  width: 50%;
  align-self: center;
`;

const FlashcardsPage = () => {
  const location = useLocation();
  const { deck } = location.state;
  const { updateCardMetrics, submitResponse } = useFlashcards();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [progress, setProgress] = useState(deck.cards.map(() => ({ status: 'pending' })));
  const [repeatedCards, setRepeatedCards] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const handleFlip = () => setFlipped(!flipped);

  const handleMarkCorrect = () => {
    const newProgress = [...progress];
    newProgress[currentCardIndex].status = 'correct';
    setProgress(newProgress);
    updateCardMetrics(deck.id, deck.cards[currentCardIndex].id, true, 'userId');
    handleNext(); 
  };

const handleMarkIncorrect = () => {
    const newProgress = [...progress];
    newProgress[currentCardIndex].status = 'incorrect';
    setProgress(newProgress);

    // Randomly reinsert the card into the remaining deck if not the last card
    if (currentCardIndex < deck.cards.length - 1) {
        const randomIndex = Math.floor(Math.random() * (deck.cards.length - currentCardIndex - 1)) + currentCardIndex + 1;
        deck.cards.splice(randomIndex, 0, deck.cards[currentCardIndex]);
        newProgress.splice(randomIndex, 0, { status: 'pending' });
    } else {
        setRepeatedCards([...repeatedCards, deck.cards[currentCardIndex]]);
    }

    updateCardMetrics(deck.id, deck.cards[currentCardIndex].id, false, 'userId');
    handleNext();
};
  

  const handleNext = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    } else if (repeatedCards.length > 0) {
      setCurrentCardIndex(deck.cards.length); // Move to the first repeated card
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const handleSubmitResponses = async () => {
    const finalResponse = await submitResponse()
    setTotalScore(finalResponse.score);
    setShowResultModal(true);
};

  const handleDotClick = (index) => {
    if (index < deck.cards.length) {
      setCurrentCardIndex(index);
    } else {
      setCurrentCardIndex(index);
    }
    setFlipped(false);
  };

  const currentCard = currentCardIndex < deck.cards.length 
    ? deck.cards[currentCardIndex] 
    : repeatedCards[currentCardIndex - deck.cards.length];

  const totalCards = deck.cards.length + repeatedCards.length;

  return (
    <FlashcardsContainer>
      <Header />
      <StyledCard flipped={flipped}>
        <div className="inner-card">
          <div className="front">
            <TopSection>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Chip label={currentCard.difficulty} color="primary" />
                <IconButton onClick={() => setDialogOpen(true)} style={{ color: 'white' }}>
                  <InfoIcon />
                </IconButton>
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Chip label={currentCard.difficulty} color="primary" />
                <IconButton onClick={() => setDialogOpen(true)} style={{ color: 'white' }}>
                  <InfoIcon />
                </IconButton>
              </div>
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
        {repeatedCards.map((_, index) => (
          <div
            key={index + deck.cards.length}
            className={`dot ${'incorrect'} ${currentCardIndex === index + deck.cards.length ? 'current' : ''}`}
          ></div>
        ))}
      </ProgressDots>
      <NavigationWrapper>
        <NavigationButton onClick={handlePrev} variant="contained" color="primary" disabled={currentCardIndex === 0}>
          <ArrowBack />
        </NavigationButton>
        <NavigationButton onClick={handleNext} variant="contained" color="primary" disabled={currentCardIndex >= totalCards - 1}>
          <ArrowForward />
        </NavigationButton>
      </NavigationWrapper>
      {currentCardIndex === totalCards - 1 && progress.every((p) => p.status !== 'pending') && (
  <SubmitButton onClick={handleSubmitResponses} variant="contained">
    Enviar Respostas
  </SubmitButton>
  
)}
      <PracticeResultModal 
        open={showResultModal} 
        onClose={() => setShowResultModal(false)} 
        totalScore={totalScore} 
      />
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Exemplo Prático</DialogTitle>
        <DialogContent>
          <Typography>{currentCard.practiceExample}</Typography>
        </DialogContent>
      </Dialog>
    </FlashcardsContainer>
  );
};

export default FlashcardsPage;
