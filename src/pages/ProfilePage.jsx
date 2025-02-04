// Importação direta das imagens das badges
import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Slider from 'react-slick';
import { Typography } from '@mui/material';
import { useFlashcards } from '../context/FlashcardsContext';
import { useQuiz } from '../context/QuizContext';
import { mapFlashcardBadges, mapQuizBadges, getFinalBadge } from '../utils/badgesMapper';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BadgePageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  padding-top: 6rem;
  background-color: #f5f5f5;
  max-height: 100%;
`;

const Title = styled(Typography)`
  && {
    font-size: 1.5rem;
    font-weight: bold;
    color: #5650F5;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`;

const FinalBadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const BadgeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Alinha verticalmente */
  text-align: center;
  width: 120px; /* Garante uma largura consistente para alinhamento */
  margin: 0 auto; /* Centraliza dentro do slider */
`;

const BadgeImage = styled.img`
  width: ${({ isFinal }) => (isFinal ? '140px' : '100px')};
  height: ${({ isFinal }) => (isFinal ? '140px' : '100px')};
  border-radius: 50%;
  border: 3px solid ${({ unlocked }) => (unlocked ? '#FFD700' : '#ccc')};
  filter: ${({ unlocked }) => (unlocked ? 'none' : 'grayscale(100%)')};
  opacity: ${({ unlocked }) => (unlocked ? '1' : '0.6')};
  transition: all 0.3s ease;
 

  &:hover {
    transform: ${({ unlocked }) => (unlocked ? 'scale(1.1)' : 'none')};
  }
`;

const BadgeTitle = styled(Typography)`
  && {
    font-size: ${({ isFinal }) => (isFinal ? '1rem' : '0.8rem')};
    font-weight: bold;
    color: ${({ unlocked }) => (unlocked ? '#5650F5' : '#aaa')};
    margin-top: 0.4rem;
  }
`;

const SlidersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
`;

const SliderSection = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: center;

  .slick-slide {
    display: flex !important;
    justify-content: center;
    align-items: center;
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

  const sliderSettings = {
    dots: false,
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
        <Title>Meu Mural de Conquistas</Title>

        {/* Badge Final */}
        <FinalBadgeWrapper>
          <BadgeWrapper>
            <BadgeImage src={finalBadge.image} unlocked={finalBadge.unlocked} isFinal alt={finalBadge.title} />
            <BadgeTitle unlocked={finalBadge.unlocked} isFinal>
              {finalBadge.unlocked ? finalBadge.title : 'Badge Final Bloqueada'}
            </BadgeTitle>
          </BadgeWrapper>
        </FinalBadgeWrapper>

        {/* Sliders */}
        <SlidersWrapper>
          {/* Flashcards Slider */}
          <SliderSection>
            <Typography variant="h5" color="textSecondary" style={{ marginBottom: '1rem' }}>
              Flashcards
            </Typography>
            <Slider {...sliderSettings}>
              {flashcardBadges.map((badge) => (
                <BadgeWrapper key={badge.id}>
                  <BadgeImage src={badge.image} unlocked={badge.unlocked} alt={badge.title} />
                  <BadgeTitle unlocked={badge.unlocked}>{badge.unlocked ? badge.title : 'Badge Bloqueada'}</BadgeTitle>
                </BadgeWrapper>
              ))}
            </Slider>
          </SliderSection>

          {/* Quizzes Slider */}
          <SliderSection>
            <Typography variant="h5" color="textSecondary" style={{ marginBottom: '1rem' }}>
              Quizzes
            </Typography>
            <Slider {...sliderSettings}>
              {quizBadges.map((badge) => (
                <BadgeWrapper key={badge.id}>
                  <BadgeImage src={badge.image} unlocked={badge.unlocked} alt={badge.title} />
                  <BadgeTitle unlocked={badge.unlocked}>{badge.unlocked ? badge.title : 'Badge Bloqueada'}</BadgeTitle>
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
