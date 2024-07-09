import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed


# Endereços dos três bancos participantes
bancos_participantes = ["http://172.16.103.12:5030", "http://172.16.103.13:5030", "http://172.16.103.11:5030"]



ip1 = "http://172.16.103.12:5030"
ip2 = "http://172.16.103.13:5030"
ip3 = "http://172.16.103.11:5030"


def criar_cliente(url, cliente):
    response = requests.post(f"{url}/criar_cliente", json=cliente)
    if response.status_code == 201:
        print(f"Cliente criado com sucesso em {url}: {cliente}")
    else:
        print(f"Erro ao criar cliente em {url}: {response.text}")

def criar_conta(url, conta):
    response = requests.post(f"{url}/criar_conta", json=conta)
    if response.status_code == 201:
        print(f"Conta criada com sucesso em {url}: {conta}")
    else:
        print(f"Erro ao criar conta em {url}: {response.text}")

# transferência 
def realizar_transferencia_composta(url, transferencia):
    response = requests.post(f"{url}/transferencia_composta", json=transferencia)
    if response.status_code == 200:
        print(f"Transferência composta realizada com sucesso em {url}: {transferencia}")
    else:
        print(f"Erro ao realizar transferência composta em {url}: {response.text}")


criar_cliente(ip1, {"cpf": "11111111111", "nome": "Pessoa 1", "tipo": "Fisico"})
criar_cliente(ip2, {"cpf": "11111111111", "nome": "Pessoa 1", "tipo": "Fisico"})
criar_cliente(ip3, {"cpf": "22222222222", "nome": "Pessoa 1", "tipo": "Fisico"})


criar_conta(ip1, {"cpf": "11111111111", "numero": "123", "saldo_inicial": 1000, "conjunta": False, "titulares": ["11111111111"]})
criar_conta(ip2, {"cpf": "11111111111", "numero": "456", "saldo_inicial": 1000, "conjunta": False, "titulares": ["11111111111"]})
criar_conta(ip3, {"cpf": "22222222222", "numero": "789", "saldo_inicial": 1000, "conjunta": False, "titulares": ["22222222222"]})



# Dados das transferências 
transferencias_compostas = [
    {
        "participantes": [
            {"banco": 0, "cpf": "11111111111", "numero": "123", "valor": 100},
            {"banco": 1, "cpf": "11111111111", "numero": "456", "valor": 100},
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
        future.result()  

print("Testes concluídos.")
