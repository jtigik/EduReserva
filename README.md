
# Gerenciador de Reservas de Salas - Escola de Ensino Médio

[![Status](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/seu-usuario/gerenciador-reservas-salas) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Descrição

Este é um aplicativo web simples e responsivo para gerenciar reservas de salas de aula em uma escola de ensino médio regular. Desenvolvido com foco em usabilidade para professores e coordenadores, o app permite visualizar disponibilidade, criar novas reservas, editar e cancelar agendamentos de forma intuitiva.

### Contexto da Escola
- **Estrutura Física**: 5 andares, com 4 salas por andar (total de 20 salas, identificadas como "Andar X - Sala Y").
- **Turnos e Turmas**:
  - **Manhã**: 1º ao 5º ano do Fundamental (7h às 12h, 5 horários de 50 minutos).
  - **Tarde**: 6º ao 9º ano do Fundamental (13h às 18h, 5 horários de 50 minutos).
  - **Noite**: 1º ao 3º ano do Médio (19h às 22h, 3 horários de 60 minutos).
- **Regras**: Reservas para atividades extracurriculares, reuniões ou eventos (não para aulas regulares). Máximo 1 reserva por sala/horário. Suporte a datas dos próximos 30 dias.

O app usa armazenamento local (localStorage) para persistência de dados, simulando um banco de dados simples. Ideal para demo ou uso em rede local.

## Funcionalidades

- **Dashboard**: Calendário interativo, filtros por data/andar/turno e visualização de salas disponíveis/reservadas em cards coloridos.
- **Nova Reserva**: Formulário com validação de disponibilidade, seleção de data, sala, turno, horários, motivo, responsável e participantes.
- **Visualização de Reservas**: Tabela filtrável com ações de editar/cancelar (via modais).
- **Autenticação**: Login simples (demo: email `admin@escola.com`, senha `1234`).
- **Responsividade**: Totalmente mobile-friendly com Bootstrap 5.
- **Acessibilidade**: Suporte a ARIA, labels e alto contraste.

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, Bootstrap 5.
- **Interatividade**: JavaScript Vanilla (sem frameworks pesados).
- **Armazenamento**: localStorage para reservas (dados em JSON).
- **Outros**: Date API para calendário dinâmico.

## Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari ou Edge).
- Nenhum servidor backend necessário (roda localmente).
- Para desenvolvimento: Editor de texto (VS Code recomendado) e Git.

## Instalação

1. Clone o repositório:
   ```
   git clone https://github.com/seu-usuario/gerenciador-reservas-salas.git
   ```

2. Abra o diretório do projeto:
   ```
   cd gerenciador-reservas-salas
   ```

3. Abra `index.html` diretamente no navegador (duplo-clique ou via "Abrir com" > Navegador).

   - O app carrega dados de exemplo automaticamente no localStorage.
   - Para resetar dados: Limpe o localStorage no DevTools (F12 > Application > Storage > Clear site data).

## Como Usar

1. **Login**: Acesse via formulário inicial (credenciais de demo acima).
2. **Dashboard**: Selecione uma data e filtre salas. Clique em "Nova Reserva" para agendar.
3. **Criar Reserva**:
   - Preencha o formulário.
   - Clique em "Verificar Disponibilidade" (vermelho se conflitar).
   - Confirme para salvar.
4. **Gerenciar Reservas**: Na página de visualização, use filtros e ações na tabela.
5. **Logout**: Via navbar superior.

**Exemplo de Fluxo**:
- Vá para Dashboard > Selecione data > Filtre por "Andar 1" > Veja cards de salas > Nova Reserva > Escolha "Manhã - Horário 1" > Confirme.

**Notas**:
- Datas futuras apenas (próximos 30 dias).
- Máximo 30 participantes por reserva.
- Em produção, integre com backend (ex.: Node.js + MongoDB) para multi-usuário.

## Estrutura do Projeto

```
gerenciador-reservas-salas/
├── index.html          # Página principal (dashboard e rotas via JS)
├── style.css           # Estilos personalizados (variáveis CSS)
├── script.js           # Lógica JS (validações, localStorage, DOM)
├── assets/             # Imagens e ícones (opcional, placeholders)
│   └── logo-escola.png
└── README.md           # Este arquivo
```

Para uma versão separada, divida em múltiplos HTMLs (login.html, dashboard.html, etc.), mas a versão inline é otimizada para simplicidade.

## Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto.
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

**Diretrizes**:
- Mantenha código limpo e comentado.
- Teste em desktop/mobile.
- Evite dependências externas.

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

- **Autor**: [Seu Nome ou xAI Demo] - [seu-email@exemplo.com](mailto:seu-email@exemplo.com)
- **Repositório**: [github.com/seu-usuario/gerenciador-reservas-salas](https://github.com/seu-usuario/gerenciador-reservas-salas)
- **Issues**: Reporte bugs ou sugestões [aqui](https://github.com/seu-usuario/gerenciador-reservas-salas/issues).

Obrigado por usar o Gerenciador de Reservas! 📚🗓️