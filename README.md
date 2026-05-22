# Vellux FrontEnd

Este é o repositório FrontEnd do projeto Vellux, desenvolvido com **React** e **Vite**. O projeto utiliza **Tailwind CSS** para estilização, além de diversas bibliotecas modernas para entregar uma interface fluida e interativa.

## Tecnologias Utilizadas

- **React 19**
- **Vite 6** (Build Tool super rápido)
- **Tailwind CSS v4** (Estilização utilitária)
- **Firebase** (Backend as a Service)
- **Lucide React** (Ícones)
- **Framer Motion / Motion** (Animações)
- **Recharts** (Gráficos)
- **TypeScript** (Tipagem estática)

##  Instalação e Execução

Você pode rodar o projeto localmente de duas formas: utilizando Node.js tradicionalmente ou através do Docker.

### Via Node.js (Local)

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

### Via Docker

Se preferir rodar o ambiente isolado, basta utilizar o Docker Compose:

1. Suba o container do frontend:
   ```bash
   docker-compose up -d
   ```
   
   O aplicativo estará rodando na porta `3000` por padrão em ambos os casos.

## 🛠 Scripts Disponíveis

No diretório do projeto, você pode rodar os seguintes comandos:

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Cria a versão de produção (build) otimizada do aplicativo.
- `npm run preview`: Inicia um servidor local para visualizar a versão de produção gerada no passo anterior.
- `npm run lint`: Checa os tipos e roda o linter pelo TypeScript.

## Estrutura de Diretórios

O projeto segue a estrutura padrão do Vite/React, com os componentes e páginas localizados na pasta `src/`.
Arquivos estáticos e públicos ficam na pasta `public/`.
