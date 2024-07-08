export interface Participant {
    banco: number;
    cpf: string;
    numero: string;
    valor: number;
  }
  
  export interface TransactionDetail {
    banco: number;
    banco_destino?: number;
    cpf: string;
    cpf_destino?: string;
    numero: string;
    numero_destino?: string;
    valor: number;
    valor_total?: number;
  }
  
  export interface Transaction {
    id: string;
    detalhes: string;
    status: string;
    transacao: {
      id?: string;
      participantes?: Participant[];
      transacao?: TransactionDetail[];
    };
  }
  
  export interface TransactionTableProps {
    transactions: Transaction[];
  }
  
  export interface SearchParamProps {
    searchParams: {
      page?: string;
    };
  }
  