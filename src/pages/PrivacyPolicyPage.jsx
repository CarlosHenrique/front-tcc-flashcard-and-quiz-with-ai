import React from 'react';
import { Container, Typography } from '@mui/material';

const PrivacyPolicyPage = () => {
  return (
    <Container maxWidth="md" style={{ padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Política de Privacidade do Jogo Educativo de Ensino de Requisitos
      </Typography>
      <Typography paragraph>
        Esta Política de Privacidade descreve como o jogo educativo "Ensino de Requisitos" (doravante referido como "o Jogo"), desenvolvido como parte de uma pesquisa de TCC e disponibilizado via web, coleta, usa e protege as informações de seus usuários.
      </Typography>
      <Typography variant="h6" gutterBottom>1. Dados Coletados</Typography>
      <Typography paragraph>
        O Jogo foi projetado para ser educativo e, como tal, coleta informações estritamente relacionadas ao desempenho e interação do usuário dentro do ambiente de jogo. Nosso objetivo é analisar a eficácia do Jogo como ferramenta de ensino, e não coletar dados pessoais identificáveis.
      </Typography>
      <Typography paragraph>
        Coletamos as seguintes informações:
        <ul>
          <li>Progresso no Jogo: nível, fases completadas, tempo, pontuação e respostas.</li>
          <li>Interações no Jogo: cliques, uso de ajuda e outras ações.</li>
          <li>Dados Técnicos: tipo e versão do navegador, sistema operacional.</li>
        </ul>
      </Typography>
      <Typography variant="h6" gutterBottom>2. Finalidade da Coleta de Dados</Typography>
      <Typography paragraph>
        As informações coletadas são utilizadas exclusivamente para fins de pesquisa acadêmica e melhoria do Jogo.
      </Typography>
      <Typography variant="h6" gutterBottom>3. Compartilhamento de Dados</Typography>
      <Typography paragraph>
        Não compartilhamos dados com terceiros, exceto:
        <ul>
          <li>Para fins de pesquisa acadêmica (dados anonimizados).</li>
          <li>Se exigido por lei.</li>
        </ul>
      </Typography>
      <Typography variant="h6" gutterBottom>4. Armazenamento e Segurança dos Dados</Typography>
      <Typography paragraph>
        Os dados são armazenados de forma segura, com acesso restrito aos pesquisadores. Após a conclusão da pesquisa, os dados brutos poderão ser excluídos.
      </Typography>
      <Typography variant="h6" gutterBottom>5. Direitos do Usuário</Typography>
      <Typography paragraph>
        Como não coletamos dados pessoais identificáveis, os direitos tradicionais não se aplicam, mas garantimos transparência sobre o uso dos dados.
      </Typography>
      <Typography variant="h6" gutterBottom>6. Alterações a Esta Política de Privacidade</Typography>
      <Typography paragraph>
        Podemos atualizar esta Política. Mudanças significativas serão comunicadas no site. O uso contínuo implica aceitação.
      </Typography>
      <Typography variant="h6" gutterBottom>7. Contato</Typography>
      <Typography paragraph>
        Para dúvidas, entre em contato pelo email: <b>carlos.henriquesouza@ufrpe.br</b>.
      </Typography>
      <Typography paragraph>
        Ao utilizar o jogo "Ensino de Requisitos", você concorda com os termos desta Política de Privacidade.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicyPage; 
