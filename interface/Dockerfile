# Use a imagem Node.js como base
FROM node:20-slim AS base


# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e package-lock.json (se existirem) para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Build do projeto (usando npm run build, ajuste conforme necessário)
RUN npm run build

# Exponha a porta 3000 para acesso externo (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
