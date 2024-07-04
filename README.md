<h1 align="center">
  <br>
    <img width="400px" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/logo.gif"> 
  <br>
  Sistema Bancário Distribuído
  <br>
</h1>

<h4 align="center">Projeto da disciplina TEC 502 - Concorrência e Conectividade </h4>

<p align="center">
<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nailasuely/Redes-Problem2/blob/main/README.md)


> Esse é um projeto da disciplina TEC 502 - Concorrência e Conectividade, no qual ocorre o desenvolvimento de  um sistema de transferências bancárias distribuído. O sistema foi projetado para permitir a criação de contas bancárias e a realização de transações financeiras entre contas de diferentes bancos de forma descentralizada. 

</div>

<details open="open">
<summary>Sumário</summary>

- [Introdução](#Introdução)
- [Tecnologias e Ferramentas Utilizadas](#Tecnologias-e-Ferramentas-Utilizadas)
- [Metodologia](#Metodologia)
  - [Cliente](#Classe-Cliente)
  - [Conta](#Classe-Conta)
  - [Banco](#Classe-Banco)
  - [Comunicação entre Servidores (Bancos)](#Comunicação-entre-Bancos)
- [Testes](#Testes)
- [Como utilizar](#Como-utilizar)
- [Conclusão](#Conclusão)
- [Equipe](#equipe)
- [Tutor](#tutor)
- [Referências](#referências)

</details>


![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)

## Introdução 

A Internet das Coisas (IoT) ganhou destaque nas últimas décadas ao conectar objetos físicos à internet, permitindo a coleta e compartilhamento de dados de forma remota. Segundo Dias (2016), a IoT refere-se a um conceito revolucionário que transforma objetos comuns em dispositivos inteligentes capazes de coletar, transmitir e receber dados, além de responder a comandos de forma autônoma ou interativa. Essa abordagem, proposta por Dias, reforça a ideia de que a IoT não apenas conecta dispositivos, mas também cria novas oportunidades para automação, monitoramento e controle em uma variedade de setores.

Diante da crescente relevância da IoT, uma empresa direcionou uma startup para desenvolver um serviço que simplifique a comunicação entre dispositivos e aplicações
A proposta  é criar um serviço de broker que facilite a troca de mensagens entre dispositivos e aplicações, utilizando como base o subsistema de rede TCP/IP.

Para atender aos requisitos e restrições do projeto, o desenvolvimento foi realizado utilizando Python para o backend, tanto para o serviço broker quanto para o dispositivo virtual, enquanto a aplicação foi desenvolvida em React para a interface do usuário. A comunicação entre os dispositivos virtuais e o serviço broker foi implementada utilizando a interface de socket nativa do TCP/IP para comandos e UDP para dados, enquanto a comunicação entre o serviço broker e a aplicação foi realizada por meio de uma API RESTful.

![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)

## Tecnologias e Ferramentas Utilizadas
- **Python:** Linguagem de programação. 
- **Flask:**  Framework web em Python usado para realizar a implementação a API RESTful.
- **Threading:** Módulo em Python utilizado para implementar threads e permitir operações concorrentes.
- **JSON:** Formato de dados utilizado para troca de mensagens entre o broker e os dispositivos.
- **CORS** (Cross-Origin Resource Sharing): Extensão Flask  que é utilizada para permitir solicitações de diferentes origens para API.
- **Postman:** Plataforma para teste e desenvolvimento de APIs,
- **Docker:** Ferramenta para empacotar e distribuir aplicativos em contêineres.
  
![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)

## Metodologia 

<div align="center">
 <img width="800px" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/visao_geral.svg">
  <p> Fig 1. Exemplo da Visão Geral </p>
</div>

A arquitetura do sistema foi desenvolvida com o objetivo de criar uma solução em um conceito no qual cada banco atua como um servidor que gerencia suas próprias contas, clientes e transações. O servidor do banco gerencia as transações financeiras e lida com a concorrência para garantir que as operações sejam realizadas de forma que não ocorra problemas nos valores. O algoritmo Two-Phase Commit (2PC) é utilizado para fazer a coordenação das transações que envolvem múltiplos bancos para garantir que todas as partes concordem com a transação ou a revertam.

Na estrutura básica de um sistema bancário, cada banco atua de forma independente, mas colaborando através de um protocolo padronizado de envio de mensagens (API REST) para gerenciar contas e um padrão de transações atômicas (Two-Phase Commit) para realizar transações. Então, cada banco deve ser capaz de lidar com suas operações internas e interagir com outros bancos para completar transações que envolvem múltiplas instituições. E esses outros bancos devem fazer parte de um consórcio que é designado no próprio código, no qual é verificado quais estão disponíveis e quais não.

Na Figura 1, é apresentada uma visão geral do sistema distribuído de transações bancárias. Por exemplo, partindo de um consórcio bancário formado por três instituições: Banco A, Banco B e Banco C. Então o cliente pode se cadastrar em qualquer um dos bancos participantes do consórcio. Quando ele está cadastrado, o cliente pode abrir uma conta individual, uma conta jurídica ou uma conta conjunta, dependendo da necessidade. A principal funcionalidade do sistema é a capacidade de realizar transferências entre contas em diferentes bancos que fazem parte do consórcio. A partir de qualquer banco, o cliente pode transferir fundos para uma conta existente em outro banco participante.

Ou seja, a estrutura geral do projeto é composta por três classes: Cliente, Conta e Banco.

### Classe Cliente

A classe `Cliente` realiza a representação de um cliente do banco. Um cliente pode ser uma pessoa física ou uma pessoa jurídica. Ela faz um armazenamento de dados das informações básicas sobre o cliente e a lista de contas associada a ele. 

### Classe Conta

A classe `Conta` realiza a representação de uma conta bancária individual que pode ser vinculada a um ou dois clientes. Ela faz o gerenciamento de operações bancárias como depósitos, saques e transferências e guarda um registro dos titulares da conta.`

### Classe Banco

A classe `Banco` faz o papel completo de um servidor um banco, incluindo a administração de clientes e contas e a gerência de todas as transações que envolvem um ou mais bancos. Ela também lida com a comunicação entre bancos para garantir a integridade das transações com o 2PC.
Para isso ser possível, ela tem uma série de atributos:

- **clientes:** Um dicionário que armazena todos os clientes cadastrados no banco. Cada cliente é associado ao seu CPF único e às suas informações pessoais.
- **lock:** Um objeto de bloqueio disponibilizado pela biblioteca threading para garantir o acesso seguro a objetos compartilhados em múltiplas threads e evitar condições de corrida. 
- **bancos_participantes:** Uma lista que guarda os IPs dos bancos participantes do consórcio. Essa lista é inicializada com os IPs dos bancos antes de começar a operação do banco.
- **transacoes_pendentes:** Um dicionário que mantém o registro de transações que estão aguardando confirmação ou rollback.
  
Gerenciamento de Clientes e Contas: Para fazer o gerenciamento o código possui duas funções importantes além das rotas da api: `criar_cliente` e `criar_conta` que permite a criação de novos clientes e novas contas caso elas ainda não existam. E tudo isso sendo controlado pelo objeto lock para garantir que apenas uma thread acesse por vez.  Os métodos aceitam CPF, número da conta, saldo inicial, e indica se a conta é conjunta ou não. Eles garantem que a conta ou o cliente sejam criados apenas se as condições forem atendidas e se todos os titulares existirem, registrando a criação da conta no log e retornando as informações da nova conta.

Depósitos e Saque: Também, como em um banco comum pode ocorrer operações de depósito e saque através dos métodos depositar e sacar.
`depositar`: Este método permite adicionar fundos a uma conta existente. Ele busca o cliente e a conta que foi escolhida  e realiza a operação de depósito. O uso de Lock garante que a operação de depósito seja realizada de forma segura, evitando que duas threads acessem a conta ao mesmo tempo e alterem o saldo de forma errada.
`sacar`: Este método realiza a operação de saque, retirando fundos de uma conta existente. Similar ao depósito, o uso do Lock fazendo com que a operação de saque seja atômica e que não haja problemas de concorrência ao acessar e modificar o saldo da conta.
`creditar`: No geral esse método aqui é bem semelhante ao depositar, mas esse é para ser usado nas transferências compostas. Basicamente, adiciona fundos a uma conta específica e utiliza um Lock para garantir que a operação de crédito é realizada de maneira consistente. 

Transferências (PIX): Para gerenciar transferências entre contas de diferentes bancos ou transferências internas, a classe Banco oferece o método ´transferir´ e o método mais completo que permite várias transações que é o método `transferencia_composta`.

`transferir`: É uma função mais simples que foi criada no intuito de fazer transferências rápidas de banco para outro banco, ou no mesmo banco sem uso de vários envolvidos. Para isso, ele realiza transferências de fundos entre contas de clientes,. O método utiliza um Lock para garantir que as operações de transferência sejam seguras e não haja condições de corrida ao acessar e modificar as contas envolvidas.
`transferencia_composta`: Este método implementa o protocolo de Commit em Duas Fases (2PC) para coordenar a transferência de fundos entre múltiplos bancos, mas também é capaz de realizar transferências simples também. Ele será melhor abordado no tópico `Comunicação entre servidores`

Gerenciamento de Transações: Aqui estão as funções que são necessárias para o protocolo de comunicação que é usado nas transferências. 
`preparar_transacao`: Este método prepara uma transação composta verificando se há saldo suficiente e reservando os valores necessários para a transação.
`commit_transacao`: Este método confirma a transação composta após a fase de preparo. Ele se comunica com os bancos participantes para realizar o commit ou o rollback da transação. 
`abort_transacao`: Se a transação não pode ser concluída, este método é chamado para reverter todas as operações realizadas durante a transação.

### Comunicação entre Bancos

A comunicação entre os bancos é o ponto chave do problema, no qual deve ocorrer a realização de transações interbancárias e a coordenação de transações compostas. Este processo envolve a troca de informações e comandos entre diferentes servidores de bancos para garantir que todas as partes envolvidas em uma transação estejam sincronizadas e que as operações sejam realizadas corretamente

A classe utiliza a biblioteca requests para enviar requisições HTTP aos bancos do consórcio. Este protocolo de rede é utilizado para criar um cliente HTTP que pode fazer chamadas a endpoints RESTful expostos por outros servidores. As operações de GET, POST são usadas para solicitar informações, enviar comandos, e realizar transações financeiras entre servidores.

No caso do código é utilizado apenas GET é usado para consultar o status dos bancos e POST é usado para iniciar transações e enviar comandos de operação. Este processo de comunicação é essencial para realizar operações interbancárias e para a coordenação das transações compostas como visto em todas requisições disponíveis na tabela a seguir.

| Método | URL                        | Descrição                                                                                     |
|--------|----------------------------|-----------------------------------------------------------------------------------------------|
| `GET`   | `/clientes`                | Lista todos os clientes cadastrados.                                                         |
| `GET`   | `/contas/<cpf>`           | Lista todas as contas associadas a um cliente, especificado pelo CPF.                        |
| `POST`  | `/criar_cliente`          | Cria um novo cliente com CPF, nome e tipo especificados.                                     |
| `POST`  | `/criar_conta`            | Cria uma nova conta para um cliente com o CPF especificado, incluindo número, saldo inicial e se é uma conta conjunta. |
| `POST`  | `/depositar`              | Deposita um valor em uma conta específica, identificada pelo CPF e número da conta.           |
| `POST`  | `/sacar`                  | Realiza um saque de um valor específico em uma conta, identificada pelo CPF e número da conta. |
| `POST`  | `/transferir`            | Realiza uma transferência de fundos entre contas de clientes diferentes.                      |
| `POST`  | `/transferencia_composta` | Realiza uma transferência composta que pode envolver múltiplos bancos e participantes.       |
| `POST`  | `/prepare`                | Solicita a preparação de uma transação no protocolo de dois fases (2PC).                       |
| `POST`  | `/commit`                 | Solicita o commit de uma transação no protocolo de dois fases (2PC).                           |
| `POST`  | `/abort`                  | Solicita o abort de uma transação no protocolo de dois fases (2PC).                            |
| `POST`  | `/creditar`               | Credita um valor em uma conta específica, identificada pelo CPF e número da conta.            |
| `GET`   | `/status`                 | Verifica o status do servidor, retornando um simples "ok" se o servidor estiver funcionando.   |

Aqui o exemplo de como testar algumas rotas:  

**Rota:** `POST /criar_cliente`

**Exemplo de requisição:**

```json
{
    "cpf": "12345678900",
    "nome": "Pessoa 1",
    "tipo": "Físico"
}
```

**Rota:** `POST /criar_conta`

**Exemplo de requisição:**

```json
{
    "cpf": "12345678900",
    "numero": "12345-6",
    "saldo_inicial": 1000,
    "conjunta": false,
    "titulares": ["12345678900"]
}
```
**Rota:** `POST /depositar`

**Exemplo de requisição:**

```json
{
    "cpf": "12345678900",
    "numero": "12345-6",
    "valor": 100
}

```
**Rota:** `POST /sacar`

**Exemplo de requisição:**

```json
{
    "cpf": "12345678900",
    "numero": "12345-6",
    "valor": 200
}
```

**Rota:** `POST /Transferência Composta`

**Exemplo de requisição:**

```json
{
    "participantes": [
        {
            "banco": 0,
            "cpf": "12345678900",
            "numero": "12345-6",
            "valor": 200
        },
        {
            "banco": 1,
            "cpf": "11111111111",
            "numero": "45678-0",
            "valor": 300
        },
        {
            "banco": 2,
            "cpf": "22222222222",
            "numero": "78910-0",
            "valor": 0
        }
    ]
}

```


####  Implementação do Protocolo 2PC

Como falado anteriormente, para tratar os problemas de concorrência e garantir que todos os bancos estejam na mesma sincronia quando se trata de uma transação conjunta foi implementado o Protocolo Two Phase Commit. O 2PC foi escolhido por ser um dos protocolos completos que é amplamente utilizado para garantir a consistência distribuída. Ele tem como fim garantir que todas as partes envolvidas em uma transação concordem sobre o sucesso ou a falha da operação, evitando  problemas de inconsistência onde algumas partes realizam a transação enquanto outras não. A seguir, vou mostrar detalhadamente como o protocolo funciona e como foi implementado nesse projeto.

- A ordem é a seguinte: 
  1. Fase de Preparação:
      - Início da Transação:
        - Um cliente inicia uma transação que envolve múltiplos bancos.
        - O Banco Coordenador, que é o banco que inicia o chamado, envia uma requisição de preparação para todos os bancos participantes utilizando conexões HTTP.
        - Mensagem que é enviada: PREPARE {transaction_id, detalhes_transacao}
      - Recebimento e Processamento:
        - Cada Banco Participante recebe a requisição PREPARE e verifica se pode realizar a transação.
        - Se puder, responde com PREPARED {transaction_id}, armazenando um log de preparação.
        - Caso contrário, responde com ABORT {transaction_id}.
  2. Fase de Commit/Rollback:
      - Commit da Transação:
        - Se todos os bancos participantes responderem com PREPARED, o Banco Coordenador envia uma requisição de commit para todos os bancos utilizando conexões HTTP
        - Mensagem que é enviada: COMMIT {transaction_id}
      - Rollback da Transação:
        - Se algum banco responder com ABORT, o Banco Coordenador envia uma requisição de rollback para todos os bancos utilizando conexões HTTP sobre TCP.


####  Aplicação  

## Testes

Nos testes, além dos realizados diretamente na aplicação React, também foram executados testes utilizando o Postman. Abaixo estão os resultados desses testes realizados por meio do Postman.

<div align="center">
   <img width="" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/adicionar%20clientes.svg" />
    <p> Fig 10. Adicionar Clientes</p>
</div>
A imagem acima ilustra o teste para adição de clientes ao sistema. O processo é realizado enviando uma solicitação POST para a rota /criar_cliente com os dados necessários, como CPF, nome e tipo de cliente. O teste valida se um cliente novo pode ser adicionado corretamente ao banco, e o retorno esperado é uma confirmação da criação do cliente, com o status HTTP 201 (Criado). 

</p>

<div align="center">
   <img width="" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/adicionar_contas.svg" />
    <p> Fig 11. Adicionar Contas </p>
</div>
Agora esse teste acima mostra o teste para adição de contas para um cliente. A solicitação POST é feita na rota /criar_conta, onde são fornecidos dados como CPF do cliente, número da conta e saldo inicial, se é conta conjunta e se for quais são os titulares (lembrando que essas duas ultimas são opcionais). Este teste verifica se uma nova conta pode ser criada para um cliente existente, e o retorno esperado é uma confirmação da criação da conta, com o status HTTP 201 (Criado).

</p>

<div align="center">
   <img width="" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/verificacao_clientes.svg" />
    <p> Fig 12. Informações dos clientes antes do pix </p>
</div>
Nesse testeé exibido o teste para a verificação das informações dos clientes antes do pix. Através de uma solicitação GET para a rota /clientes, é possível visualizar todos os clientes registrados no sistema, o que inclui suas contas e saldos. Este teste é realizado para verificar se os dados dos clientes estão corretamente armazenados antes de realizar uma transação de Pix. O retorno que é esperado é uma lista com todas as informações dos clientes e suas contas.

</p>

<div align="center">
   <img width="" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/pix.svg" />
    <p> Fig 13. Realização do Pix </p>
</div>
Nesse momento estamos testando o pix em si entre contas. Utilizando a rota /transferencia_composta, são enviados dados para realizar uma transferência entre contas de diferentes clientes e nesse caso nos diferentes bancos, partindo do Banco 0. O teste verifica se a transação é processada corretamente e se o saldo é ajustado conforme esperado. O retorno esperado é uma confirmação da transação com o status HTTP 200 (OK). 

</p>

<div align="center">
   <img width="" src="https://github.com/nailasuely/distributed-banking-system/blob/main/assets/apos_pix.svg" />
    <p> Fig 14. Informações dos clientes após o pix </p>
</div>
A imagem acima mostra o teste para a verificação das informações dos clientes após a transação de Pix. Após a realização de uma transferência, uma nova solicitação GET para a rota /clientes é feita para verificar se as alterações no saldo das contas dos clientes foram aplicadas corretamente. O retorno esperado é uma atualização das informações dos clientes para poder visualizar se após o pix os dados estão corretos. 


</p>

![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)
## Como utilizar 

1. **Usando Docker:**
    - Vá até o diretório no qual o `bank` está localizado.
    - Execute o seguintes comando para iniciar:
      
        ```
        docker-compose up --build
        ```
    - Antes, não esqueça de definir o consórcio no código. 

![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)
## Conclusão 
Por fim, o projeto conseguiu desenvolver um sistema para gerenciamento de transações bancárias distribuídas, permitindo a comunicação eficiente entre diferentes bancos e contas. No qual ocorreu a implementação de funcionalidades essenciais como criação de contas, realização de transações, transferências entre bancos e sincronização de dados.

Durante o desenvolvimento, foi adquirida uma compreensão aprofundada dos princípios de sistemas distribuídos, comunicação entre servidores pela API REST e implementação do algoritmo de Two Phase Commit (2PC). Também houve a compreensão de como aplicar para garantir que os dados estejam corretos. 

Além disso, algumas melhorias ainda podem ser feitas, como a implementação de mecanismos adicionais de autenticação e também  um reforço na camada do algoritmo também é necessário, utilizando mais testes rigorosos para garantir que a consistência das transações seja sempre mantida, mesmo em casos de alta concorrência e problemas com a rede.

Dessa forma, o conhecimento adquirido neste projeto pode ser aplicado tanto em sistemas bancários, quanto em outros projetos que envolvem  sistemas distribuídos que exigem comunicação segura entre servidores e também utilizam padrões de atomicidade. 

![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)


## Equipe

- Naila Suele

## Tutores

- Elinaldo Santos de Gois Junior
- Antônio A. T. R. Coutinho

   
</div>

![-----------------------------------------------------](https://github.com/nailasuely/breakout-problem3/blob/main/assets/img/prancheta.png)

## Referências 
> - [1] Python Software Foundation. "threading — Thread-based parallelism." Python 3.12.3 documentation. https://docs.python.org/3/library/threading.html. Acessado em 2024.
> - [2] Python Software Foundation. "socket — Low-level networking interface." Python 3.12.3 documentation. https://docs.python.org/3/library/socket.html. Acessado em 2024.
> - [3] Pallets Projects. "Flask Documentation (3.0.x)." Flask. https://flask.palletsprojects.com/en/3.0.x/api/. Acessado em 2024.
> - [4] Kosinski, Daniel Santos. "A digitalização dos meios de pagamento: o pix e as central bank digital currencies em perspectiva comparada." Textos de Economia 24.1 (2021). Acessado em 2024. 
