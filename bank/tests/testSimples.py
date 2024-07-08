import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed


# Endereços dos três bancos participantes
bancos_participantes = ["http://localhost:5030", "http://localhost:5031", "http://localhost:5032"]

# Dados dos clientes
clientes = [
    {"cpf": "12345678900", "nome": "Pessoa 1", "tipo": "Físico"},
    {"cpf": "11111111111", "nome": "Pessoa 2", "tipo": "Físico"},
    {"cpf": "22222222222", "nome": "Pessoa 3", "tipo": "Físico"}
]

# Dados das contas
contas = [
    {"cpf": "12345678900", "numero": "12345-6", "saldo_inicial": 1000, "conjunta": False, "titulares": ["12345678900"]},
    {"cpf": "11111111111", "numero": "45678-0", "saldo_inicial": 500, "conjunta": False, "titulares": ["11111111111"]},
    {"cpf": "22222222222", "numero": "78910-0", "saldo_inicial": 300, "conjunta": False, "titulares": ["22222222222"]}
]

# Função para criar clientes
def criar_cliente(url, cliente):
    response = requests.post(f"{url}/criar_cliente", json=cliente)
    if response.status_code == 200:
        print(f"Cliente criado com sucesso em {url}: {cliente}")
    else:
        print(f"Erro ao criar cliente em {url}: {response.text}")

# Função para criar contas
def criar_conta(url, conta):
    response = requests.post(f"{url}/criar_conta", json=conta)
    if response.status_code == 200:
        print(f"Conta criada com sucesso em {url}: {conta}")
    else:
        print(f"Erro ao criar conta em {url}: {response.text}")

# Função para realizar transferência composta
def realizar_transferencia_composta(url, transferencia):
    response = requests.post(f"{url}/transferencia_composta", json=transferencia)
    if response.status_code == 200:
        print(f"Transferência composta realizada com sucesso em {url}: {transferencia}")
    else:
        print(f"Erro ao realizar transferência composta em {url}: {response.text}")


"""criar_cliente("http://localhost:5030", {"cpf": "11111111111", "nome": "Pessoa 1", "tipo": "Fisico"})
criar_cliente("http://localhost:5031", {"cpf": "11111111111", "nome": "Pessoa 1", "tipo": "Fisico"})
criar_cliente("http://localhost:5032", {"cpf": "22222222222", "nome": "Pessoa 1", "tipo": "Fisico"})


criar_conta("http://localhost:5030", {"cpf": "11111111111", "numero": "123", "saldo_inicial": 1000, "conjunta": False, "titulares": ["11111111111"]})
criar_conta("http://localhost:5031", {"cpf": "11111111111", "numero": "456", "saldo_inicial": 1000, "conjunta": False, "titulares": ["11111111111"]})
criar_conta("http://localhost:5032", {"cpf": "22222222222", "numero": "789", "saldo_inicial": 1000, "conjunta": False, "titulares": ["22222222222"]})
"""


# Dados das transferências compostas
transferencias_compostas = [
    {
        "participantes": [
            {"banco": 0, "cpf": "11111111111", "numero": "123", "valor": 100},
            {"banco": 1, "cpf": "11111111111", "numero": "456", "valor": 50},
            {"banco": 2, "cpf": "22222222222", "numero": "789", "valor": 0}
        ]
    },
    {
        "participantes": [
            {"banco": 0, "cpf": "11111111111", "numero": "123", "valor": 200},
            {"banco": 1, "cpf": "11111111111", "numero": "456", "valor": 300},
            {"banco": 2, "cpf": "22222222222", "numero": "789", "valor": 0}
        ]
    },
    {
        "participantes": [
            {"banco": 0, "cpf": "11111111111", "numero": "123", "valor": 200},
            {"banco": 1, "cpf": "11111111111", "numero": "456", "valor": 300},
            {"banco": 2, "cpf": "22222222222", "numero": "789", "valor": 0}
        ]
    }
]
#realizar_transferencia_composta("http://localhost:5030", transferencia_composta1)
#realizar_transferencia_composta("http://localhost:5030", transferencia_composta2)
#realizar_transferencia_composta("http://localhost:5030", transferencia_composta3)

with ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(realizar_transferencia_composta, bancos_participantes[0], transferencia) for transferencia in transferencias_compostas]
    for future in as_completed(futures):
        future.result()  # Garante que qualquer exceção é propagada
print("Testes concluídos.")

'''
# Realizando a transferência composta
for url in bancos_participantes:
    realizar_transferencia_composta(url, transferencia_composta)



# Criação dos clientes em cada banco
for url in bancos_participantes:
    for cliente in clientes:
        criar_cliente(url, cliente)

# Criação das contas nos respectivos bancos
contas_bancos = [contas[0], contas[1], contas[2]]  # Cada conta vai para um banco
for i, url in enumerate(bancos_participantes):
    criar_conta(url, contas_bancos[i])'''