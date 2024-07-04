"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BankCard from './BankCard';
import { countTransactionCategories } from '@/lib/utils';
import Category from './Category';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IP } from '@/components/IP';

// Atualize o tipo de propriedade para incluir onlineBanks
interface RightSidebarProps {
  user: {
    $id: string;
    firstName: string;
  };
  transactions: Transaction[];
  banks: {
    id: string;
    appwriteItemId: string;
    name: string;
    balance: number;
    numero: string;
  }[];
  onlineBanks: { id: string; status: string }[];  // Adicione a nova prop para bancos online
}

const RightSidebar = ({ user, transactions, banks, onlineBanks }: RightSidebarProps) => {
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  
  useEffect(() => {
    setCategories(countTransactionCategories(transactions));
  }, [transactions]);

  return (
    <aside className="right-sidebar">
      <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <Image
              src="\icons\perfil.svg"  // Substitua com a URL da imagem do perfil se disponível
              width={100}
              height={100}
              alt="profile"
            />
          </div>

          <div className="profile-details">
            <h1 className='profile-name'>
              Banco
            </h1>
            <p className="profile-email">
              {IP}
            </p>
          </div>
        </div>
      </section>

      <section className="banks">
        <div className="flex w-full justify-between">
          <h2 className="header-2">Minhas contas</h2>
          <Link href="/" className="flex gap-2">
            <Image 
              src="/icons/plus.svg"
              width={20}
              height={20}
              alt="plus"
            />
            <h2 className="text-14 font-semibold text-gray-600">
              
            </h2>
          </Link>
        </div>

        {banks?.length > 0 && (
          <div className="relative flex flex-1 flex-col items-center justify-center gap-5">
            {banks.map((bank, index) => (
              <div
                key={bank.id}
                className={`relative ${index > 0 ? 'mt-[-40px]' : ''} z-10`}
              >
                <BankCard 
                  account={{
                    id: bank.id,
                    appwriteItemId: bank.id,
                    name: bank.name,
                    balance: bank.balance,
                    numero: bank.numero
                  }}
                  userName={user.firstName}
                  showBalance={false}
                />
              </div>
            ))}
          </div>
        )}


        <section className="online-banks mt-10">
          <h2 className="header-2">Bancos ativados</h2>
          <Table>
            <TableHeader className="bg-[#f9fafb]">
              <TableRow>
                <TableHead className="px-2">Bank</TableHead>
                <TableHead className="px-2">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onlineBanks.map((bank) => (
                <TableRow key={bank.id} className="bg-[#F6FEF9] !over:bg-none !border-b-DEFAULT">
                  <TableCell className="pl-2 pr-10">
                    {bank.id}
                  </TableCell>
                  <TableCell className="pl-2 pr-10">
                    {bank.status === 'on' ? 'Online' : 'Offline'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

      </section>
    </aside>
  )
}

export default RightSidebar;
