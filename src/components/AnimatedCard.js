import React from 'react';
import styled from 'styled-components';
import { fadeIn, slideIn, pulse } from '../styles/animations';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 20px;
  margin: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  transition: ${({ theme }) => theme.transitions.default};
  animation: ${fadeIn} 0.5s ease, ${slideIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.large};
    animation: ${pulse} 1s ease infinite;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 10px 0;
`;

const Content = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const AnimatedCard = ({ title, content }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Content>{content}</Content>
    </Card>
  );
};

export default AnimatedCard; 