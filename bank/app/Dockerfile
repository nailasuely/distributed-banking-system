FROM python:3.9-slim

COPY . ./app
WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

EXPOSE 5030

CMD ["python", "bank.py"]