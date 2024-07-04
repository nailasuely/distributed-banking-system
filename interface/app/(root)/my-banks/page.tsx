"use client";

import React, { useEffect, useState } from 'react';
import BankCard from '@/components/BankCard';
import HeaderBox from '@/components/HeaderBox';
import { IP } from "@/components/IP";

interface Account {
  numero: string;
  saldo: number;
}

interface Cliente {
  contas: Account[];
  cpf: string;
  nome: string;
  tipo: string;
}

const MyBanks = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://${IP}/clientes');
        const data: Cliente[] = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Dados de exemplo 
  const loggedIn = {
    $id: 'user123',
    firstName: 'Teste',
  };

  return (
    <section className='flex'>
      <div className="my-banks">
        <HeaderBox 
          title="Minhas Contas Bancárias"
          subtext="Verifique suas atividades bancárias"
        />

        <div className="space-y-4">
          <h2 className="header-2">
            Suas Contas
          </h2>
          <div className="flex flex-wrap gap-6">
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              clientes.map((cliente) =>
                cliente.contas.map((conta, index) => (
                  <BankCard 
                    key={`${cliente.cpf}-${index}`}
                    account={{ id: conta.numero, appwriteItemId: conta.numero, name: cliente.nome, balance: conta.saldo, numero: conta.numero }}
                    userName={cliente.nome} // Passando o nome do cliente
                  />
                ))
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyBanks;
