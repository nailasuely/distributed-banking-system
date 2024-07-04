from flask import Flask, request, jsonify
import requests
import logging
from threading import Lock
import uuid
from flask_cors import CORS
import threading
import time

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
CORS(app)

class Cliente:
    """
    Essa aqui é a classe que representa um cliente do banco.
    Mantém informações sobre o CPF, nome e tipo do cliente (Físico, Jurídico, Conjunto).
    E também armazena as contas relacionadas ao cliente.
    """
    def __init__(self, cpf, nome, tipo):
        self.cpf = cpf
        self.nome = nome
        self.tipo = tipo  
        self.contas = []

    """
    Função para adicionar uma conta nova para o cliente.  

    Args:
        conta (Conta): A conta a ser adicionada.

    """
    def adicionar_conta(self, conta):
        self.contas.append(conta)

    """
    É usada para converter os dados as cliente e suas contas em um dicionário.
    
    Returns:
        dict: Dicionário com CPF, nome, tipo e contas do cliente.
    """
    def to_dict(self):
        return {
            'cpf': self.cpf,
            'nome': self.nome,
            'tipo': self.tipo,
            'contas': [conta.to_dict() for conta in self.contas]
        }

class Conta:
    """
    Classe para fazer a representação da conta bancária. 
    
    Attributos:
        numero (str): Número da conta.
        saldo (float): Saldo que tá na conta.
    """
    def __init__(self, numero, saldo_inicial=0, titulares=None):
        self.numero = numero
        self.saldo = saldo_inicial
        self.titulares = titulares if titulares else []

    """
    Adiciona valor na conta.
    
    Args:
        valor (float): Valor p/ ser depositado.
    """   
    def depositar(self, valor):
        #logging.info(f"\n antes saldo: {self.saldo}")
        #logging.info("ta vindo para ca em depositar")
        self.saldo += valor
        #logging.info(f"\n depois saldo: {self.saldo}")

    """
    Remove um valor do saldo da conta se tiver dinheiro.
    
    Args:
        valor (float): Valor a ser removido. 
    
    Returns:
        bool: True se o saque for bem-sucedido, False se não for. 
    """
    def sacar(self, valor):
        if valor <= self.saldo:
            self.saldo -= valor
            return True
        return False
    
    """
    # Essa eu nao uso.
    Realiza uma transferência de dinheiro para outra conta, 
    realizando o saque e o depósito.
    
    Args:
        valor (float): Valor para tranferir.
        conta_destino (Conta): Conta para a qual o valor será transferido.
    
    Returns:
        bool: True se a transferência for feita, False se n for. 
        """
    def transferir(self, valor, conta_destino):
        if self.sacar(valor):
            conta_destino.depositar(valor)
            return True
        return False

    def to_dict(self):
        return {
            'numero': self.numero,
            'saldo': self.saldo
        }

class Banco:
    """
    Essa classe é para fazer a representação de um banco.
    Feita para gerenciar clientes, contas, transações e faz as operações como depósitos, saques e transferências(pix).
    E lida com a comunicação com bancos participantes para transações compostas.
    
    Attributos:
        contador (int): Apenas para fazer o controle de quando começa a pedir o status do banco.
        clientes (dict): Dicionário para armazenar os clientes do banco.
        lock (Lock): Lock para fazer o acesso seguro aos dados compartilhados.
        bancos_participantes (list): Lista de IPs dos bancos do consórcio.
        transacoes_pendentes (dict): Dicionário para armazenar transações pendentes.
    """
    def __init__(self):
        self.contador = 0
        self.clientes = {}
        self.lock = Lock()
        #self.bancos_participantes = ["localhost:5000", "localhost:5001", "localhost:5002", "192.168.0.181:5000", "192.168.0.160:5001"] 
        #self.bancos_participantes = ["192.168.0.181:5000", "192.168.0.160:5001"]   
        self.bancos_participantes = ["192.168.0.181:5000", "192.168.0.181:5001", "192.168.0.181:5002"] 
        self.bancos_funcionando = []
        self.transacoes_pendentes = {}
        self.verificar_bancos_funcionando() 
         
    """
    Cria um novo cliente e o adiciona na lista de clientes do banco, se o cliente não existir.
    
    Args:
        cpf (str): CPF do cliente.
        nome (str): Nome do cliente.
        tipo (str): Tipo do cliente (Físico, Jurídico, Conjunto).
    
    Returns:
        dict: Dicionário com informações do cliente se criado com sucesso e retorna none se o cliente ja existir. 
    """
    def criar_cliente(self, cpf, nome, tipo):
        with self.lock:
            if cpf not in self.clientes:
                cliente = Cliente(cpf, nome, tipo)
                self.clientes[cpf] = cliente
                logging.info(f"Cliente criado: {nome}, CPF: {cpf}")
                return cliente.to_dict()
            else:
                logging.warning(f"Cliente já existe: CPF {cpf}")
                return None
            
    def criar_conta(self, cpf, numero, saldo_inicial=0, conjunta=False, titulares=None):
        """
        Cria conta.

        Args:
            cpf (str): CPF do cliente.
            numero (str): Número da conta a ser criada.
            saldo_inicial (float, optional): Saldo inicial da conta. Se n colocar é 0.
            conjunta (bool, opcional): Indica se a conta é conjunta. Se n colocar é false.
            titulares (list, opcional): Lista de CPFs dos titulares da conta.
        
        Returns:
            dict or None: Dicionário com informações da conta se criada, None caso contrário.
        """
        with self.lock:
            if not titulares:
                titulares = [cpf]

            for titular in titulares:
                cliente = self.clientes.get(titular)
                if cliente:
                    conta_individual_existente = any(not c.titulares for c in cliente.contas)
                    if conta_individual_existente and not conjunta:
                        logging.warning(f"Cliente {titular} já possui uma conta individual e não é conjunta.")
                        return None

            nova_conta = Conta(numero, saldo_inicial, titulares)
            
            for titular in titulares:
                cliente = self.clientes.get(titular)
                if cliente:
                    cliente.contas.append(nova_conta)
                else:
                    logging.warning(f"Cliente não encontrado: {titular}")
                    return None
                
            logging.info(f"Conta criada: {numero} para os titulares: {', '.join(titulares)}")
            return nova_conta.__dict__

    """
        Verifica se os bancos participantes estão funcionando e atualiza a lista de bancos funcionando.
    """
    def verificar_bancos_funcionando(self):
        bancos_funcionando_temp = []
        if self.contador != 0: 
            for banco in self.bancos_participantes:
                try:
                    ip, porta = banco.split(':')
                    url = f"http://{ip}:{porta}/status"  
                    response = requests.get(url, timeout=5)  
                    if response.status_code == 200:
                        bancos_funcionando_temp.append(banco)
                except requests.RequestException as e:
                    logging.error(f"Banco {banco}: off")

            with self.lock:
                self.bancos_funcionando = bancos_funcionando_temp
        self.contador += 1

        threading.Timer(2, self.verificar_bancos_funcionando).start()  # Verifica a cada 60 segundos

    
    """
        Realiza um depósito na conta mas nao é muito usado pois a conta ja começa com um saldo inicial.
        
        Args:
            cpf (str): CPF do cliente.
            numero (str): Número da conta onde o depósito será feito.
            valor (float): Valor p ser depositado.
        
        Returns:
            bool: True se o depósito for feito, False caso contrário.
        """
    def depositar(self, cpf, numero, valor):
        logging.info(f"\n\nVALORES E COISAS AQUI em depositar: {valor} na conta: {numero} do cliente: {cpf} em depositar")
        with self.lock:
            logging.info(f"\n\nacho q nem ta entrando aq {valor} na conta: {numero} do cliente: {cpf}\n")
            cliente = self.clientes.get(cpf)
            if cliente:
                conta = next((c for c in cliente.contas if c.numero == numero), None)
                if conta:
                    conta.depositar(valor)
                    logging.info(f"Depósito feito: {valor} na conta: {numero} do cliente: {cpf}")
                    return True
        logging.warning(f"Depósito falhou: Cliente ou conta não encontrado: CPF {cpf}, Conta {numero}")
        return False

    """
        Função para saque.
        
        Args:
            cpf (str): CPF do cliente.
            numero (str): Número da conta de onde o saque será feito.
            valor (float): Valor a ser sacado.
        
        Returns:
            bool: True se o saque for bem-sucedido, False caso contrário.
        """
    def sacar(self, cpf, numero, valor):
        with self.lock:
            cliente = self.clientes.get(cpf)
            if cliente:
                conta = next((c for c in cliente.contas if c.numero == numero), None)
                if conta:
                    if conta.sacar(valor):
                        logging.info(f"Saque realizado: {valor} da conta: {numero} do cliente: {cpf}")
                        return True
        logging.warning(f"Saque falhou: Saldo insuficiente ou conta não encontrada: CPF {cpf}, Conta {numero}")
        return False

    def transferir(self, cpf_origem, numero_origem, cpf_destino, numero_destino, valor):
        """
        Usada para tranferir, mas geralmente é usada a outra função para tudo.
        
        Args:
            cpf_origem (str): CPF do cliente de origem.
            numero_origem (str): Número da conta de origem.
            cpf_destino (str): CPF do cliente de destino.
            numero_destino (str): Número da conta de destino.
            valor (float): Valor a ser transferido.
        
        Returns:
            bool: True se a transferência for bem-sucedida, False caso contrário.
        """
        with self.lock:
            cliente_origem = self.clientes.get(cpf_origem)
            cliente_destino = self.clientes.get(cpf_destino)
            if cliente_origem and cliente_destino:
                conta_origem = next((c for c in cliente_origem.contas if c.numero == numero_origem), None)
                conta_destino = next((c for c in cliente_destino.contas if c.numero == numero_destino), None)
                if conta_origem and conta_destino:
                    if conta_origem.transferir(valor, conta_destino):
                        logging.info(f"Transferência realizada: {valor} de {cpf_origem} conta {numero_origem} para {cpf_destino} conta {numero_destino}")
                        return True
        logging.warning(f"Transferência falhou: Conta(s) não encontrada(s) ou saldo insuficiente")
        return False

    def transferencia_composta(self, transacao):
        """
        Realiza uma transferência composta ou simples.
        Esse método faz um processo de commit em duas fases (2PC) para a transação. Primeiro ele prepara cada participante,
        aí se todos estiverem prontos ele confirma a transação, mas se algum participante falhar, ele desfaz tudo
        
        Args:
            transacao (dict): Dicionário com informações da transação composta.
        """
        logging.info(f"Iniciando transferência composta para transação ID: {transacao['id']}")
        total_prepared = True
        prepare_requests = []
        commit_requests = []
        rollback_requests = []
        bancos_falharam_prepare = []
        banco_destino = transacao['participantes'][-1]['banco']  # O último banco é o destino final
        conta_destino_numero = transacao['participantes'][-1]['numero']
        cpf_destino = transacao['participantes'][-1]['cpf']
        

        # Calcula o valor total 
        logging.info(f"\n\ntransacoes: {transacao} \n\n")
        valor_total = sum(p['valor'] for p in transacao['participantes'][:-1])
        logging.info(f"\nvalor total: {valor_total}\n")

        # fase de prepare
        for participante in transacao['participantes']:
            banco_participante = participante['banco']
            ip, porta = self.bancos_participantes[banco_participante].split(':')
            prepare_url = f"http://{ip}:{porta}/prepare"
            prepare_requests.append({
                "url": prepare_url,
                "json": {
                    "id": transacao['id'],
                    "participantes": [{
                        "cpf": participante['cpf'],
                        "numero": participante['numero'],
                        "valor": participante['valor'],
                        "banco": participante['banco'],
                        "banco_destino": banco_destino,
                        "numero_destino": conta_destino_numero,
                        "cpf_destino": cpf_destino

                    }]
                }
            })

        # Envia todas as requisições de prepare
        for request in prepare_requests:
            try:
                response = requests.post(request["url"], json=request["json"])
                if response.status_code != 200:
                    total_prepared = False
                    bancos_falharam_prepare.append(request["url"])
                    logging.warning(f"Preparação falhou para transação ID: {transacao['id']} no participante {request['url']}")
                    break  
            except requests.RequestException as e:
                total_prepared = False
                bancos_falharam_prepare.append(request["url"])
                logging.error(f"Erro ao comunicar com participante {request['url']}: {e}")
                # se prepare falhar aí para
                break  

        if total_prepared:
            logging.info("\nTodos os bancos estão prepadados\n")
            time.sleep(5)
            # Se tudo der certo faz o commit
            all_commit_success = True  # variavel de controle
            for participante in transacao['participantes']:
                banco_participante = participante['banco']
                ip, porta = self.bancos_participantes[banco_participante].split(':')
                if banco_participante == banco_destino and participante['numero'] == conta_destino_numero :  
                    commit_url = f"http://{ip}:{porta}/creditar"
                    commit_requests.append({
                        "url": commit_url,
                        "json": {
                            "cpf": participante['cpf'],
                            "numero": participante['numero'],
                            "valor": valor_total  # Credita o valor total calculado
                        }
                    })
                else:
                    commit_url = f"http://{ip}:{porta}/commit"
                    commit_requests.append({
                        "url": commit_url,
                        "json": {"id": transacao['id']}
                    })

            # Envia as requisições 
            for request in commit_requests:
                try:
                    response = requests.post(request["url"], json=request["json"])
                    if response.status_code != 200:
                        all_commit_success = False  # false em caso de falha
                        logging.warning(f"Commit falhou para transação ID: {transacao['id']} no participante {request['url']}")
                        # adiciona a transacao de falha para ela ser revertida. 
                        self.transacoes_pendentes[transacao['id']] = transacao['participantes']
                        logging.info(f"Transação ID: {transacao['id']} adicionada às pendências para possível retry")
                        break  # se um commit falhar, não faz rollback
                except requests.RequestException as e:
                    all_commit_success = False  # Modifica a variável para false em caso de erro
                    logging.error(f"Erro ao comunicar com participante {request['url']}: {e}")
                    break  # se um commit falhar, não faz rollback

            if not all_commit_success:
                # se o commit falhar faz o rollback 
                for participante in transacao['participantes']:
                    banco_participante = participante['banco']
                    ip, porta = self.bancos_participantes[banco_participante].split(':')
                    rollback_url = f"http://{ip}:{porta}/abort"
                    rollback_requests.append({
                        "url": rollback_url,
                        "json": {"id": transacao['id'], "participantes": transacao['participantes']}
                    })
                for request in rollback_requests:
                    try:
                        requests.post(request["url"], json=request["json"])
                    except requests.RequestException as e:
                        logging.error(f"Erro ao comunicar com participante {request['url']}: {e}")
                
                return False  # a transação falhou e foi revertida
            else:
                # Após o commit feito, remove a transação das pendências
                self.commit_transacao(transacao['id'])
                return True  # feito corretamente 
        else:
            logging.info("\nTodos os bancos NAO estãos prepadados\n")
            # Fase de rollback 
            for participante in transacao['participantes']:
                banco_participante = participante['banco']
                ip, porta = self.bancos_participantes[banco_participante].split(':')
                rollback_url = f"http://{ip}:{porta}/abort"
                rollback_prepare = f"http://{ip}:{porta}/prepare"
                if rollback_prepare not in bancos_falharam_prepare:
                    rollback_requests.append({
                        "url": rollback_url,
                        "json": {"id": transacao['id'], "participantes": transacao['participantes']}
                    })
            for request in rollback_requests:
                try:
                    requests.post(request["url"], json=request["json"])
                except requests.RequestException as e:
                    logging.error(f"Erro ao comunicar com participante {request['url']}: {e}")

            # Isso aqui talvez eu remova dps 
            # !!!!!!!!!!!!!!!!!!!!!!!!!!!!
            self.transacoes_pendentes[transacao['id']] = transacao['participantes']
            logging.info(f"Transação ID: {transacao['id']} adicionada às pendências para possível retry")

            return False  # A transação falhou no prepare


    def preparar_transacao(self, transacao):
        """
        Prepara uma transação composta para o processo de commit em duas fases (2PC).
        Verifica se tem saldo em cada conta participante e reserva os valores necessários,
        mas não confirma a transação ainda.

        Args:
            transacao (dict): Dicionário contendo as informações da transação composta. Deve incluir:
                - 'id' (str): Identificador único da transação.
                - 'participantes' (list): Lista de participantes da transação e cada participante eh um dic com:
                    - 'cpf' (str): CPF do cliente participante.
                    - 'numero' (str): Número da conta participante.
                    - 'valor' (float): Valor a ser reservado ou transferido para a transação.
                    - 'numero_destino' (str): Número da conta destino para a transferência.
                    - 'cpf_destino' (str): CPF do cliente destino para a transferência.
                    - 'banco' (str): Banco do participante.
                    - 'banco_destino' (str): Banco do destinatário.
        """
        transacao_id = transacao['id']
        self.transacoes_pendentes[transacao_id] = transacao['participantes']
        # Verifica se tem saldo na conta.
        for participante in transacao['participantes']:
            cpf = participante['cpf']
            numero = participante['numero']
            valor = participante['valor']
            cliente = self.clientes.get(cpf)
            if cliente:
                conta = next((c for c in cliente.contas if c.numero == numero), None)
                if not conta:
                    logging.error(f"Conta com número {numero} não encontrada para o cliente com CPF {cpf}.")
                    return False
                if conta.saldo < valor:
                    logging.info(f"\n\nNão há saldo suficiente na conta número {numero}. Saldo disponível: {conta.saldo}\n")
                    return False
        # faz a reserva do valor 
        for participante in transacao['participantes']:
            cpf = participante['cpf']
            valor = participante['valor']
            cliente = self.clientes.get(cpf)
            if cliente:
                conta = next((c for c in cliente.contas if c.numero == numero), None)
                if conta:
                    logging.info(f"\n\nantes aqui conta: {participante['numero']}\n conta destino {participante['numero_destino']}")
                    logging.info(f"\n\nantes aqui banco participante: {participante['banco']}\n banco destino {participante['banco_destino']}")
                    if participante['banco'] != participante['banco_destino'] and participante['numero'] != participante['numero_destino']:  # Não reserva valor no banco destino)
                        conta.saldo -= valor
                    if participante['banco'] == participante['banco_destino'] and participante['numero'] != participante['numero_destino']:
                        logging.info(f"Deve ser uma tranferencia interna") 
                        if participante['cpf'] != participante['cpf_destino']:
                            conta.saldo -= valor
        return True


    def commit_transacao(self, transacao_id):
        """
        Confirma uma transação composta se todas as verificações de preparação forem feitas
        Remove a transação das transações pendentes e confirma que a transação foi feita

        Args:
            transacao_id (str): Id único da transação que precisa ser commitada.

        Returns:
            bool: Retorna True se a transação foi confirmada, False caso contrário.
        """
        if transacao_id in self.transacoes_pendentes:
            #logging.info(f"\n\n ta deletando aqui")
            del self.transacoes_pendentes[transacao_id]
            return True
        return False

    def abort_transacao(self, transacao):
        """
        Desfaz uma transação composta se a preparação falhar. Reverte a subtração tb

        Args:
            transacao (dict): Dicionário com informações da transação composta a ser abortada. Deve incluir:
                - 'id' (str): Identificador único da transação.
        
        Returns:
            bool: Retorna True se a transação foi abortada com sucesso, False caso contrário.
        """
        transacao_id = transacao['id']
        logging.info(f"\ntrasacao_id: {transacao['id']}\ntransacoes pendentes> {self.transacoes_pendentes}")
        if transacao_id in self.transacoes_pendentes:
            # abort aqui 
            for participante in self.transacoes_pendentes[transacao_id]:
                cpf = participante['cpf']
                numero = participante['numero']
                valor = participante['valor']
                cliente = self.clientes.get(cpf)
                if cliente:
                    conta = next((c for c in cliente.contas if c.numero == numero), None)
                    if conta:
                        logging.info(f"\nem abort\nvalor: {participante['valor']}\nconta: {participante['numero']}\n")
                        conta.saldo += valor
            del self.transacoes_pendentes[transacao_id]
            return True
        return False

    def creditar(self, cpf, numero, valor):
        with self.lock:
            cliente = self.clientes.get(cpf)
            if cliente:
                conta = next((c for c in cliente.contas if c.numero == numero), None)
                if conta:
                    conta.depositar(valor)  # Deposita o valor total calculado
                    logging.info(f"Crédito realizado: {valor} na conta: {numero} do cliente: {cpf}")
                    return True
            logging.warning(f"Crédito falhou: Cliente ou conta não encontrado: CPF {cpf}, Conta {numero}")
            return False





banco = Banco()

@app.route('/bancos_on', methods=['GET'])
def bancos_funcionando_route():
    with banco.lock:
        bancos_funcionando = banco.bancos_funcionando
    return jsonify(bancos_funcionando), 200

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    clientes = [cliente.to_dict() for cliente in banco.clientes.values()]
    return jsonify(clientes), 200

@app.route('/contas/<cpf>', methods=['GET'])
def listar_contas(cpf):
    cliente = banco.clientes.get(cpf)
    if cliente:
        contas = [conta.to_dict() for conta in cliente.contas]
        return jsonify(contas), 200
    return jsonify({"error": "Cliente não encontrado"}), 404

@app.route('/criar_cliente', methods=['POST'])
def criar_cliente_route():
    data = request.json
    cpf = data['cpf']
    nome = data['nome']
    tipo = data['tipo']
    cliente = banco.criar_cliente(cpf, nome, tipo)
    if cliente:
        return jsonify(cliente), 201
    return jsonify({"error": "Cliente já existe"}), 400

@app.route('/criar_conta', methods=['POST'])
def criar_conta_route():
    data = request.json
    cpf = data.get('cpf')
    numero = data.get('numero')
    saldo_inicial = data.get('saldo_inicial', 0)
    conjunta = data.get('conjunta', False)
    titulares = data.get('titulares', [cpf])
    
    conta = banco.criar_conta(cpf, numero, saldo_inicial, conjunta, titulares)
    if conta:
        return jsonify(conta), 201
    return jsonify({'error': 'Cliente não encontrado, conta já existe ou não é permitido criar mais de uma conta individual para este cliente'}), 400


@app.route('/depositar', methods=['POST'])
def depositar_route():
    data = request.json
    cpf = data['cpf']
    numero = data['numero']
    valor = data['valor']
    if banco.depositar(cpf, numero, valor):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Cliente ou conta nao encontrado"}), 400

@app.route('/sacar', methods=['POST'])
def sacar_route():
    data = request.json
    cpf = data['cpf']
    numero = data['numero']
    valor = data['valor']
    if banco.sacar(cpf, numero, valor):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Saldo insuficiente ou conta não encontrada"}), 400

@app.route('/transferir', methods=['POST'])
def transferir_route():
    data = request.json
    cpf_origem = data['cpf_origem']
    numero_origem = data['numero_origem']
    cpf_destino = data['cpf_destino']
    numero_destino = data['numero_destino']
    valor = data['valor']
    if banco.transferir(cpf_origem, numero_origem, cpf_destino, numero_destino, valor):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Transferência falhou"}), 400

@app.route('/transferencia_composta', methods=['POST'])
def transferencia_composta_route():
    data = request.json
    transacao_id = str(uuid.uuid4())
    transacao = {
        "id": transacao_id,
        "participantes": data['participantes']
    }
    result = banco.transferencia_composta(transacao)
    if result:
        return jsonify({"success": True}), 200
    return jsonify({"error": "Transferência composta falhou"}), 400


@app.route('/prepare', methods=['POST'])
def prepare_route():
    data = request.json
    transacao_id = data['id']
    participantes = data['participantes']
    transacao = {
        "id": transacao_id,
        "participantes": participantes
    }
    if banco.preparar_transacao(transacao):
        return jsonify({"prepared": True}), 200
    return jsonify({"prepared": False}), 400

@app.route('/commit', methods=['POST'])
def commit_route():
    data = request.json
    transacao_id = data['id']
    if banco.commit_transacao(transacao_id):
        return jsonify({"committed": True}), 200
    return jsonify({"committed": False}), 400

@app.route('/abort', methods=['POST'])
def abort_route():
    data = request.json
    transacao_id = data['id']
    participantes = data['participantes']
    transacao = {
        "id": transacao_id,
        "participantes": participantes
    }
    if banco.abort_transacao(transacao):
        return jsonify({"aborted": True}), 200
    return jsonify({"aborted": False}), 400

@app.route('/creditar', methods=['POST'])
def creditar_route():
    data = request.json
    cpf = data['cpf']
    numero = data['numero']
    valor = data['valor']
    if banco.creditar(cpf, numero, valor):
        return jsonify({"success": True}), 200
    return jsonify({"error": "Crédito falhou"}), 400


@app.route('/status', methods=['GET'])
def status():
    return jsonify({'status': 'ok'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

