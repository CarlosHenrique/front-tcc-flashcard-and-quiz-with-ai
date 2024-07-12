// src/components/Flashcard.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardContent, Typography } from '@mui/material';

const FlashcardWrapper = styled.div`
  perspective: 1000px;
`;

const FlashcardInner = styled.div`
  transition: transform 0.6s;
  transform-style: preserve-3d;
  position: relative;
  width: 300px;
  height: 200px;
  transform: ${props => (props.flipped ? 'rotateY(180deg)' : 'rotateY(0)')};
`;

const FlashcardFront = styled(Card)`
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const FlashcardBack = styled(Card)`
  backface-visibility: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotateY(180deg);
`;

const Flashcard = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <FlashcardWrapper onClick={() => setFlipped(!flipped)}>
      <FlashcardInner flipped={flipped}>
        <FlashcardFront>
          <CardContent>
            <Typography variant="h5">{question}</Typography>
          </CardContent>
        </FlashcardFront>
        <FlashcardBack>
          <CardContent>
            <Typography variant="h5">{answer}</Typography>
          </CardContent>
        </FlashcardBack>
      </FlashcardInner>
    </FlashcardWrapper>
  );
};

export default Flashcard;
