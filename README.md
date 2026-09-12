# Conversor de Moedas

Aplicação front-end desenvolvida com **React** e **Vite** para realizar conversões entre moedas utilizando taxas de câmbio obtidas por uma API pública.

O projeto foi criado para praticar consumo de APIs REST, gerenciamento de estados com React Hooks, componentização, tratamento de erros e persistência de dados no navegador.

<!-- Depois de finalizar o design, adicione uma imagem na pasta public e remova este comentário.
![Demonstração do conversor](./public/preview.png)
-->

## Funcionalidades

- Conversão automática entre moedas
- Consulta de taxas de câmbio em uma API pública
- Seleção de moeda de origem e destino
- Botão para inverter as moedas
- Formatação monetária conforme a moeda selecionada
- Indicação da taxa e da data da cotação
- Estados de carregamento e erro
- Proteção contra respostas antigas da API
- Histórico das conversões realizadas
- Persistência do histórico com `localStorage`
- Interface responsiva para computadores e celulares

## Tecnologias

- React
- JavaScript
- Vite
- CSS
- Fetch API
- Intl.NumberFormat
- Local Storage
- Frankfurter API

## API utilizada

O projeto utiliza a [Frankfurter API](https://frankfurter.dev/), uma API pública de taxas de câmbio que não exige chave de autenticação.

Exemplo de endpoint:

```text
https://api.frankfurter.dev/v2/rate/USD/BRL
```

Exemplo simplificado de resposta:

```json
{
  "date": "2026-09-11",
  "base": "USD",
  "quote": "BRL",
  "rate": 5.42
}
```

## Estrutura do projeto

```text
src/
├── components/
│   └── CurrencySelect.jsx
├── data/
│   └── currencies.js
├── services/
│   └── exchangeApi.js
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

## Como executar

### Pré-requisitos

É necessário ter o [Node.js](https://nodejs.org/) instalado.

### Instalação

Clone o repositório:

```bash
git clone URL_DO_SEU_REPOSITORIO
```

Entre na pasta do projeto:

```bash
cd conversor-moedas
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse o endereço exibido pelo Vite, geralmente:

```text
http://localhost:5173
```

## Conceitos praticados

- Consumo de API REST com `fetch`
- Funções assíncronas com `async/await`
- Tratamento de erros com `try/catch/finally`
- Estados com `useState`
- Efeitos com `useEffect`
- Valores calculados com `useMemo`
- Renderização condicional
- Componentes reutilizáveis e propriedades
- Imutabilidade de arrays
- Persistência com `localStorage`
- Internacionalização de valores monetários
- Responsividade e acessibilidade básica

## Próximas melhorias

- Adicionar o design definitivo da interface
- Incluir uma captura de tela no README
- Criar tema claro e escuro
- Adicionar gráfico com o histórico das taxas
- Permitir seleção de datas anteriores
- Adicionar testes automatizados
- Publicar uma versão online

## Autor

Desenvolvido por **Jefferson Lopes da Silva**.

[GitHub](https://github.com/JLopes2024)

## Licença

Este projeto está disponível para fins de estudo e portfólio.
