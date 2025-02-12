import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Button } from '@mui/material';
import styled from 'styled-components';
import PhaseCard from './PhaseCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CarouselWrapper = styled.div`
  width: 90%;
  max-width: 90%;
  height: auto;
  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: auto;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: #5650F5;
    color: white;
    width: 10rem;
    padding: 0.5rem 1rem;
    font-size: 16px;
    font-weight: bold;
    &:hover {
      background-color: #4840e6;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: 6rem;
  height: auto;
`;

const PhaseCarousel = ({ decks, quizzes }) => {
  const sliderRef = useRef(null);

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "60px",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <CarouselWrapper>
        <Slider ref={sliderRef} {...settings}>
          {decks.map((deck) => {
            // 🔹 Encontra o quiz associado ao deck
            const associatedQuiz = quizzes.find((quiz) => quiz.deckAssociatedId === deck.id);

            return (
              <PhaseCard key={deck.id} deck={deck} quiz={associatedQuiz} />
            );
          })}
        </Slider>
      </CarouselWrapper>
      <ButtonWrapper>
        <StyledButton onClick={previous}>
          Anterior
        </StyledButton>
        <StyledButton onClick={next}>
          Próximo
        </StyledButton>
      </ButtonWrapper>
    </>
  );
};

export default PhaseCarousel;
