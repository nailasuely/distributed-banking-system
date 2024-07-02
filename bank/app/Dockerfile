# Use a imagem Python oficial.
# https://hub.docker.com/_/python
FROM python:3.9-slim

# Sete o diretório de trabalho para /app
WORKDIR /app

# Copie o arquivo atual para o contêiner em /app
COPY . .

# Instale os requisitos do aplicativo
RUN pip install --no-cache-dir -r requirements.txt

# Execute o aplicativo quando o contêiner iniciar
CMD ["python", "bank.py"]
