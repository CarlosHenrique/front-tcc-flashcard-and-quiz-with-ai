import React from 'react';
import styled from 'styled-components';

const ArrowContainer = styled.div`
  display: block;
  background-color: #5650F5; // Cor roxa do app
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1;

  &:hover {
    background-color: #4840e6; // Cor roxa mais escura ao hover
  }
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid white;
  transform: ${({ direction }) => (direction === 'left' ? 'rotate(-90deg)' : 'rotate(90deg)')};
`;

const CustomArrow = ({ className, style, onClick, direction }) => (
  <ArrowContainer className={className} style={{ ...style, display: 'block' }} onClick={onClick}>
    <Arrow direction={direction} />
  </ArrowContainer>
);

export default CustomArrow;
