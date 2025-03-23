import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { IconButton, useMediaQuery, useTheme, Typography, Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import PhaseCard from './PhaseCard';

// Estilos
const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
  padding: 2rem 0;
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
`;

const CarouselWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 0 2rem;
  box-sizing: border-box;
`;

const CarouselContent = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 480px;
  position: relative;
`;

const CardContainer = styled(motion.div)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${props => (props.isActive ? 10 : 5)};
  filter: ${props => (props.isActive ? 'none' : 'brightness(0.7) blur(1px)')};
  transform: ${props => (props.isActive ? 'scale(1)' : props.direction === 'left' ? 'scale(0.85) translateX(-100%)' : 'scale(0.85) translateX(100%)')};
  opacity: ${props => (props.isActive ? 1 : 0.7)};
  transition: all 0.3s ease;
  pointer-events: ${props => (props.isActive ? 'auto' : 'none')};
  
  @media (max-width: 768px) {
    transform: ${props => (props.isActive ? 'scale(1)' : props.direction === 'left' ? 'scale(0.75) translateX(-80%)' : 'scale(0.75) translateX(80%)')};
  }
  
  @media (min-width: 1200px) {
    transform: ${props => (props.isActive ? 'scale(1)' : props.direction === 'left' ? 'scale(0.85) translateX(-120%)' : 'scale(0.85) translateX(120%)')};
  }
`;

const NavigationButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  ${props => props.direction === 'left' ? 'left: 0;' : 'right: 0;'}
  
  @media (max-width: 768px) {
    ${props => props.direction === 'left' ? 'left: -5px;' : 'right: -5px;'}
  }
  
  @media (min-width: 1200px) {
    ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
  }
`;

const StyledIconButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 1) !important;
    transform: scale(1.1);
  }
  
  @media (min-width: 1200px) {
    width: 48px;
    height: 48px;
  }
`;

const PhaseIndicators = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 8px;
`;

const PhaseIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? '#5650F5' : '#E0E0E0'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.2);
    background-color: ${props => props.isActive ? '#5650F5' : '#BDBDBD'};
  }
`;

// Função para extrair o número da fase do título
const extractPhaseNumber = (title) => {
  if (!title) return 0;
  
  // Tenta encontrar padrões como "Fase X:" ou "Fase X"
  const match = title.match(/Fase\s+(\d+)(?:\s*:|$)/i);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  return 0; // Valor padrão se não encontrar um número
};

const PhaseCarousel = ({ decks, quizzes }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  
  // Ordena os decks pelo número da fase extraído do título
  const sortedDecks = [...decks].sort((a, b) => {
    const phaseA = extractPhaseNumber(a.title);
    const phaseB = extractPhaseNumber(b.title);
    return phaseA - phaseB;
  });
  
  const nextDeck = () => {
    setDirection('right');
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedDecks.length);
  };
  
  const prevDeck = () => {
    setDirection('left');
    setCurrentIndex((prevIndex) => (prevIndex - 1 + sortedDecks.length) % sortedDecks.length);
  };
  
  const goToDeck = (index) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };
  
  // Variantes para animação
  const variants = {
    enter: (direction) => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0,
    }),
  };
  
  // Renderiza os cards para o deck atual, anterior e próximo
  const renderCards = () => {
    const currentDeck = sortedDecks[currentIndex];
    const prevIndex = (currentIndex - 1 + sortedDecks.length) % sortedDecks.length;
    const nextIndex = (currentIndex + 1) % sortedDecks.length;
    
    const prevDeck = sortedDecks[prevIndex];
    const nextDeck = sortedDecks[nextIndex];
    
    // Encontra os quizzes associados ao deck atual
    const currentQuizzes = quizzes.filter(quiz => quiz.deckAssociatedId === currentDeck.id);
    
    return (
      <>
        {/* Card anterior */}
        <CardContainer isActive={false} direction="left">
          <PhaseCard 
            deck={prevDeck} 
            quizzes={[]} 
            isActive={false} 
            onClick={prevDeck}
            phaseNumber={extractPhaseNumber(prevDeck.title) || prevIndex + 1}
          />
        </CardContainer>
        
        {/* Card atual */}
        <CardContainer isActive={true} direction="center">
          <PhaseCard 
            deck={currentDeck} 
            quizzes={currentQuizzes} 
            isActive={true}
            phaseNumber={extractPhaseNumber(currentDeck.title) || currentIndex + 1}
          />
        </CardContainer>
        
        {/* Próximo card */}
        <CardContainer isActive={false} direction="right">
          <PhaseCard 
            deck={nextDeck} 
            quizzes={[]} 
            isActive={false} 
            onClick={nextDeck}
            phaseNumber={extractPhaseNumber(nextDeck.title) || nextIndex + 1}
          />
        </CardContainer>
      </>
    );
  };
  return (
    <CarouselContainer>
      <CarouselWrapper>
        <CarouselContent>
          {renderCards()}
        </CarouselContent>
        
        {/* Botão de navegação esquerdo */}
        <NavigationButton direction="left">
          <StyledIconButton onClick={prevDeck} aria-label="Fase anterior">
            <ChevronLeft color="primary" />
          </StyledIconButton>
        </NavigationButton>
        
        {/* Botão de navegação direito */}
        <NavigationButton direction="right">
          <StyledIconButton onClick={nextDeck} aria-label="Próxima fase">
            <ChevronRight color="primary" />
          </StyledIconButton>
        </NavigationButton>
      </CarouselWrapper>
      
      {/* Indicadores de fase */}
      <PhaseIndicators>
        {sortedDecks.map((deck, index) => (
          <Tooltip 
            key={deck.id} 
            title={`Fase ${extractPhaseNumber(deck.title) || index + 1}`}
            arrow
          >
            <PhaseIndicator 
              isActive={index === currentIndex} 
              onClick={() => goToDeck(index)}
            />
          </Tooltip>
        ))}
      </PhaseIndicators>
    </CarouselContainer>
  );
};

export default PhaseCarousel;
