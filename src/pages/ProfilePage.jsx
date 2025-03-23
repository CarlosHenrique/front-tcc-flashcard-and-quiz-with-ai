// Importação direta das imagens das badges
import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import Header from '../components/Header';
import Slider from 'react-slick';
import { Typography, Box } from '@mui/material';
import { useFlashcards } from '../context/FlashcardsContext';
import { useQuiz } from '../context/QuizContext';
import { mapFlashcardBadges, mapQuizBadges, getFinalBadge } from '../utils/badgesMapper';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

const shine = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const BadgePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-top: 6rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  min-height: 100vh;
  color: white;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled(Typography)`
  && {
    font-size: 2.5rem;
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 2rem;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    font-family: 'Press Start 2P', cursive;
    animation: ${pulse} 2s infinite;
    background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${shine} 3s linear infinite;
  }
`;

const FinalBadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(10px);
  width: 90%;
  max-width: 500px;
  animation: ${fadeIn} 1s ease-out;
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 150px;
  margin: 0 auto;
  position: relative;
  transition: all 0.3s ease;
  padding: 1rem;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BadgeImage = styled.img`
  width: ${({ isFinal }) => (isFinal ? '180px' : '140px')};
  height: ${({ isFinal }) => (isFinal ? '180px' : '140px')};
  border-radius: 50%;
  border: 4px solid ${({ unlocked }) => (unlocked ? '#FFD700' : '#666')};
  filter: ${({ unlocked }) => (unlocked ? 'none' : 'grayscale(100%)')};
  opacity: ${({ unlocked }) => (unlocked ? '1' : '0.5')};
  transition: all 0.3s ease;
  box-shadow: 0 0 15px ${({ unlocked }) => (unlocked ? 'rgba(255, 215, 0, 0.3)' : 'rgba(0, 0, 0, 0.2)')};
  object-fit: cover;

  &:hover {
    transform: ${({ unlocked }) => (unlocked ? 'scale(1.1)' : 'none')};
    box-shadow: 0 0 25px ${({ unlocked }) => (unlocked ? 'rgba(255, 215, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)')};
  }
`;

const BadgeTitle = styled(Typography)`
  && {
    font-size: ${({ isFinal }) => (isFinal ? '1.2rem' : '0.9rem')};
    font-weight: bold;
    color: ${({ unlocked }) => (unlocked ? '#FFD700' : '#888')};
    margin-top: 1rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    font-family: 'Press Start 2P', cursive;
    width: 100%;
    text-align: center;
    word-wrap: break-word;
    line-height: 1.4;
  }
`;

const SlidersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.05);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 1.2s ease-out;
`;

const SliderSection = styled.div`
  margin-bottom: 3rem;
  width: 100%;
  text-align: center;

  .slick-slide {
    display: flex !important;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .slick-track {
    display: flex;
    align-items: center;
  }
`;

const SectionTitle = styled(Typography)`
  && {
    font-size: 1.5rem;
    color: #FFD700;
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    font-family: 'Press Start 2P', cursive;
    animation: ${fadeIn} 0.8s ease-out;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  margin: 1.5rem 0;
  overflow: hidden;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Progress = styled.div`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
  background-size: 200% auto;
  transition: width 0.8s ease-in-out;
  animation: ${shine} 2s linear infinite;
`;

const ProgressText = styled(Typography)`
  && {
    font-size: 0.9rem;
    color: #FFD700;
    margin-top: 0.5rem;
    font-family: 'Press Start 2P', cursive;
  }
`;

const BadgePage = () => {
  const { decks } = useFlashcards();
  const { allQuizzes } = useQuiz();

  const flashcardBadges = mapFlashcardBadges(decks);
  const quizBadges = mapQuizBadges(allQuizzes);

  const finalBadgeData = getFinalBadge();
  const finalBadge = {
    ...finalBadgeData,
    unlocked: flashcardBadges.every((badge) => badge.unlocked) && quizBadges.every((badge) => badge.unlocked),
  };

  const calculateProgress = (badges) => {
    const unlockedCount = badges.filter(badge => badge.unlocked).length;
    return (unlockedCount / badges.length) * 100;
  };

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <>
      <Header />
      <BadgePageWrapper>
        <Title>Mural de Conquistas</Title>

        <FinalBadgeWrapper>
          <BadgeWrapper>
            <BadgeImage src={finalBadge.image} unlocked={finalBadge.unlocked} isFinal alt={finalBadge.title} />
            <BadgeTitle unlocked={finalBadge.unlocked} isFinal>
              {finalBadge.unlocked ? finalBadge.title : 'Badge Final Bloqueada'}
            </BadgeTitle>
          </BadgeWrapper>
        </FinalBadgeWrapper>

        <SlidersWrapper>
          <SliderSection>
            <SectionTitle>Flashcards</SectionTitle>
            <ProgressBar>
              <Progress progress={calculateProgress(flashcardBadges)} />
            </ProgressBar>
            <ProgressText>
              {Math.round(calculateProgress(flashcardBadges))}% Conquistado
            </ProgressText>
            <Slider {...sliderSettings}>
              {flashcardBadges.map((badge) => (
                <BadgeWrapper key={badge.id}>
                  <BadgeImage src={badge.image} unlocked={badge.unlocked} alt={badge.title} />
                  <BadgeTitle unlocked={badge.unlocked}>
                    {badge.unlocked ? badge.title : 'Badge Bloqueada'}
                  </BadgeTitle>
                </BadgeWrapper>
              ))}
            </Slider>
          </SliderSection>

          <SliderSection>
            <SectionTitle>Quizzes</SectionTitle>
            <ProgressBar>
              <Progress progress={calculateProgress(quizBadges)} />
            </ProgressBar>
            <ProgressText>
              {Math.round(calculateProgress(quizBadges))}% Conquistado
            </ProgressText>
            <Slider {...sliderSettings}>
              {quizBadges.map((badge) => (
                <BadgeWrapper key={badge.id}>
                  <BadgeImage src={badge.image} unlocked={badge.unlocked} alt={badge.title} />
                  <BadgeTitle unlocked={badge.unlocked}>
                    {badge.unlocked ? badge.title : 'Badge Bloqueada'}
                  </BadgeTitle>
                </BadgeWrapper>
              ))}
            </Slider>
          </SliderSection>
        </SlidersWrapper>
      </BadgePageWrapper>
    </>
  );
};

export default BadgePage;
