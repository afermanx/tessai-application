#!/bin/bash

# Carrega o .env correto
set -a
source ./apps/api/.env
set +a

# Executa o docker-compose com as variáveis já exportadas
docker-compose up -d

# assim que o docker-compose estiver pronto, executa o script de start do backen rodar da raiz o comando pnpm run dev

pnpm run dev
