import React, { useRef } from 'react';
import Slider from 'react-slick';
import { Button } from '@mui/material';
import styled from 'styled-components';
import PhaseCard from './PhaseCard';
import CustomArrow from './CustomArrow';
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

const phases = [
  { id: 1, title: 'Fase 1', description: 'Descrição da fase 1', unlocked: true, completed: 100, reviewed: 0,  },
  { id: 2, title: 'Fase 2', description: 'Descrição da fase 2', unlocked: false, completed: 0, reviewed: 0, image: '/path/to/image2.jpg' },
  { id: 3, title: 'Fase 3', description: 'Descrição da fase 3', unlocked: false, completed: 0, reviewed: 0, image: '/path/to/image3.jpg' },
  { id: 4, title: 'Fase 4', description: 'Descrição da fase 4', unlocked: false, completed: 0, reviewed: 0, image: '/path/to/image4.jpg' },
  { id: 5, title: 'Fase 5', description: 'Descrição da fase 5', unlocked: false, completed: 0, reviewed: 0, image: '/path/to/image5.jpg' },
  // Adicione mais fases conforme necessário
];

const PhaseCarousel = () => {
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
          {phases.map((phase) => (
            <PhaseCard key={phase.id} phase={phase} />
          ))}
        </Slider>
      </CarouselWrapper>
      <ButtonWrapper>
        <StyledButton onClick={previous}>
          Previous
        </StyledButton>
        <StyledButton onClick={next}>
          Next
        </StyledButton>
      </ButtonWrapper>
    </>
  );
};

export default PhaseCarousel;
