// Importação direta das imagens das badges
import fase1Flashcard from '../assets/images/badges/fase1-flashcard.png';
import fase2Flashcard from '../assets/images/badges/fase2-flashcard.png';
import fase3Flashcard from '../assets/images/badges/fase3-flashcard.png';
import fase4Flashcard from '../assets/images/badges/fase4-flashcard.png';
import fase5Flashcard from '../assets/images/badges/fase5-flashcard.png';
import fase6Flashcard from '../assets/images/badges/fase6-flashcard.png';
import fase7Flashcard from '../assets/images/badges/fase7-flashcard.png';
import fase8Flashcard from '../assets/images/badges/fase8-flashcard.png';
import fase9Flashcard from '../assets/images/badges/fase9-flashcard.png';
import fase10Flashcard from '../assets/images/badges/fase10-flashcard.png';

import fase1Quiz from '../assets/images/badges/fase1-quiz.png';
import fase2Quiz from '../assets/images/badges/fase2-quiz.png';
import fase3Quiz from '../assets/images/badges/fase3-quiz.png';
import fase4Quiz from '../assets/images/badges/fase4-quiz.png';
import fase5Quiz from '../assets/images/badges/fase5-quiz.png';
import fase6Quiz from '../assets/images/badges/fase6-quiz.png';
import fase7Quiz from '../assets/images/badges/fase7-quiz.png';
import fase8Quiz from '../assets/images/badges/fase8-quiz.png';
import fase9Quiz from '../assets/images/badges/fase9-quiz.png';
import fase10Quiz from '../assets/images/badges/fase10-quiz.png';

import finalBadge from '../assets/images/badges/final.png';

const images = {
  flashcards: {
    fase1: { image: fase1Flashcard, title: "Explorador de Conhecimento" },
    fase2: { image: fase2Flashcard, title:  "Desbravador de Ideias" },
    fase3: { image: fase3Flashcard, title:   "Caçador Analítico" },
    fase4: { image: fase4Flashcard, title: "Escriba das Especificações" },
    fase5: { image: fase5Flashcard, title: 'Guardião das Boas Práticas' },
    fase6: { image: fase6Flashcard, title: 'Estrategista de Complementos' },
    fase7: { image: fase7Flashcard, title: 'Mestre dos Processos' },
    fase8: { image: fase8Flashcard, title: 'Aventureiro Ágil' },
    fase9: { image: fase9Flashcard, title: 'Construtor de Experiências ' },
    fase10: { image: fase10Flashcard, title: 'Cavaleiro dos Requerimentos' },
  },
  quizzes: {
    fase1: { image: fase1Quiz, title:  "Guardião do Saber" },
    fase2: { image: fase2Quiz, title:  "Mestre das Decisões" },
    fase3: { image: fase3Quiz, title:  "Oráculo do Conhecimento" },
    fase4: { image: fase4Quiz, title:  "Lord do Conhecimento" },
    fase5: { image: fase5Quiz, title: 'Vanguarda da Excelência' },
    fase6: { image: fase6Quiz, title: 'Cartógrafo dos Requisitos' },
    fase7: { image: fase7Quiz, title: 'Dominador dos Processos' },
    fase8: { image: fase8Quiz, title: 'Campeão da Agilidade' },
    fase9: { image: fase9Quiz, title: 'Mestre do Design' },
    fase10: { image: fase10Quiz, title: 'Sentinela da Rastreabilidade' },
  },
  final: { image: finalBadge, title: 'Mestre Supremo dos Requisitos' }, 
};

export const extractPhaseNumber = (title) => {
  const match = title.match(/Fase (\d+)/i);
  return match ? `fase${match[1]}` : null;
};

export const mapFlashcardBadges = (decks) =>
  decks.map((deck) => {
    const phaseKey = extractPhaseNumber(deck.title);
    return {
      id: deck.id,
      title: images.flashcards[phaseKey]?.title || deck.title, // Usa o título amigável, se disponível
      unlocked: deck.score >= 70,
      image: images.flashcards[phaseKey]?.image || null,
    };
  });

export const mapQuizBadges = (quizzes) =>
  quizzes.map((quiz) => {
    const phaseKey = extractPhaseNumber(quiz.title);
    return {
      id: quiz.id,
      title: images.quizzes[phaseKey]?.title || quiz.title, // Usa o título amigável, se disponível
      unlocked: quiz.score >= 70,
      image: images.quizzes[phaseKey]?.image || null,
    };
  });

export const getFinalBadge = () => {
    return {
        title: images.final.title,// Usa o título amigável, se disponível
        image: images.final.image || null
      };
}

export default images;
