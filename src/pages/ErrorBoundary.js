import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("⚠️ Erro capturado pelo ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40 }}>
          <h2>Ocorreu um erro ao exibir os flashcards.</h2>
          <p>Tente recarregar a página ou voltar para a tela inicial.</p>
        </div>
      );
    }

    return this.props.children; 
  }
}
