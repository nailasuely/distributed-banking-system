"use client";

import React, { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import TransactionsTable from '@/components/TransactionsTable';
import { Pagination } from "@/components/Pagination"
import { Transaction, SearchParamProps } from "@/components/types"; 
import { IP } from "@/components/IP";

const TransactionHistory = ({ searchParams: { page = '1' } }: SearchParamProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(Number(page));
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

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox 
          title="Histórico de Transferências"
          subtext="Veja seus detalhes bancários e de transações."
        />
      </div>

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
    </div>
  );
}

export default TransactionHistory;
