// shuffleOptions.js

/**
 * Embaralha as opções de uma lista e adiciona um prefixo (a, b, c, d, etc.) a cada opção.
 * @param {Array} options - A lista de opções a serem embaralhadas.
 * @returns {Array} - A lista de opções embaralhadas com prefixos adicionados.
 */
export const shuffleOptions = (options) => {
    // Embaralha as opções usando o algoritmo de Fisher-Yates
    const shuffledOptions = options
      .map((option) => ({ option, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ option }) => option);
  
    // Adiciona prefixos (a, b, c, ...) às opções embaralhadas
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return shuffledOptions.map((option, index) => ({
      label: `${alphabet[index]}. ${option}`, // Adiciona o prefixo
      value: option, // Mantém o valor original da opção para verificação de resposta
    }));
  };
  