"use client";
import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import TransactionsTable from '@/components/TransactionsTable';
import { Pagination } from "@/components/Pagination"
import { Transaction, SearchParamProps } from "@/components/types"; 
import { IP } from "./IP";


const Recents = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [totalPages, setTotalPages] = useState<number>(1);

  const rowsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://${IP}/historico`);
        const data: Transaction[] = await response.json();
        
        setTransactions(data);
        setTotalPages(Math.ceil(data.length / rowsPerPage));
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      }
    };

    fetchTransactions();
  }, []);

 


  const currentTransactions = transactions.slice();

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <HeaderBox 
          title="Transferências Recentes"
          subtext="Veja seus detalhes bancários e de transações."
        />
       </header>

      <div className="space-y-6">
        <section className="flex w-full flex-col gap-6">
          <TransactionsTable 
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Recents;
