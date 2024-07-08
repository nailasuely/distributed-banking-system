"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionCategoryStyles } from "@/constants";
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { Modal } from "@/components/ui/modal";
import { Transaction, TransactionTableProps } from "@//components/types"; // Atualize o import
import { Button } from "./ui/button";


const CategoryBadge = ({ category }: { category: string }) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default;

  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeModal = () => {
    setSelectedTransaction(null);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">ID</TableHead>
            <TableHead className="px-2">Detalhes</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t: Transaction) => {
            const status = getTransactionStatus(new Date(t.transacao.id ? t.transacao.id : ''));
            const isDebit = t.status === 'debit';
            const isCredit = t.status === 'credit';

            return (
              <TableRow
                key={t.id}
                className={`${isDebit ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}
              >
                <TableCell className="pl-2 pr-10 font-medium text-[#344054]">{t.transacao.id ? t.transacao.id : 'N/A'}</TableCell>
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <div className="flex items-center gap-3">
                    <h1 className="text-14 truncate font-semibold text-[#344054]">
                      {(t.detalhes)}
                    </h1>
                  </div>
                </TableCell>
                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={t.status} />
                </TableCell>
                <TableCell className="pl-2 pr-10">
                  <Button type="submit"
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => handleRowClick(t)}
                  >
                    Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {selectedTransaction && (
        <Modal onClose={closeModal}>
          <div className="p-4">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              X
            </button>
            <h2 className="text-lg font-bold">Detalhes da Transação</h2>
            <p><strong>ID:</strong> {selectedTransaction.transacao.id }</p>
            <p><strong>Detalhes:</strong> {selectedTransaction.detalhes}</p>
            <p><strong>Status:</strong> {selectedTransaction.status}</p>
            {selectedTransaction.transacao.id && (
              <>
                <h3 className="mt-4 font-semibold">Participantes:</h3>
                <ul>
                  {selectedTransaction.transacao.participantes?.map((participant, index) => (
                    <li key={index}>
                      Banco: {participant.banco}, CPF: {participant.cpf}, Número: {participant.numero}, Valor: {formatAmount(participant.valor)}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {selectedTransaction.transacao.transacao && (
              <>
                <h3 className="mt-4 font-semibold">Transações:</h3>
                <ul>
                  {selectedTransaction.transacao.transacao?.map((tran, index) => (
                    <li key={index}>
                      Banco: {tran.banco}, Banco Destino: {tran.banco_destino}, CPF: {tran.cpf}, CPF Destino: {tran.cpf_destino}, Número: {tran.numero}, Número Destino: {tran.numero_destino}, Valor: {formatAmount(tran.valor)}, Valor Total: {formatAmount(tran.valor_total || 0)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default TransactionsTable;
