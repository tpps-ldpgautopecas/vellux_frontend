# SiteVellux Frontend

Este é o repositório do frontend para o projeto SiteVellux.

## Tecnologias
- Node.js (Vite)
- Docker & Docker Compose

## Pré-requisitos

- Docker e Docker Compose instalados.

## Como rodar localmente com Docker

1. Na raiz do repositório (onde este arquivo está localizado), execute o comando para construir e subir o container do frontend:

```bash
docker-compose up -d --build
```

2. O frontend estará disponível em `http://localhost:5173`.

### Desenvolvimento
O container está configurado com os volumes para habilitar o *Hot Reload*. As alterações nos arquivos locais refletirão imediatamente no container.
