"use client";

import React from "react";
import AnimatedCounter from './AnimatedCounter';

// URLs das imagens
const totalClientsImage = "/icons/client.svg"; // Imagem para Total de Clientes
const numberOfAccountsImage = "/icons/cartao.svg"; // Imagem para Número de Contas
const totalAmountImage = "/icons/money.svg"; // Imagem para Total em Dinheiro

interface AnalyticsProps {
    totalClients: number;
    totalAccounts: number;
    totalCurrentBalance: number; // Atualizado o nome da propriedade
  }
  
  const Analytics: React.FC<AnalyticsProps> = ({
    totalClients,
    totalAccounts,
    totalCurrentBalance,
  }) => {
  return (
    <main className="mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Clients */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center justify-between hover:shadow-xl hover:shadow-rose-400"> {/* Adicionando a classe hover:shadow-rose-400 */}
          <div className="info">
            <h3 className="text-lg font-semibold text-gray-700">Total de Clientes</h3>
            <h1 className="text-2xl font-bold text-gray-900">{totalClients}</h1>
          </div>
          <div className="relative w-32 h-32"> {/* Tamanho atualizado para w-32 h-32 */}
            <img src={totalClientsImage} alt="Total de Clientes" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
        {/* Number of Accounts */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center justify-between hover:shadow-xl hover:shadow-rose-400"> {/* Adicionando a classe hover:shadow-rose-400 */}
          <div className="info">
            <h3 className="text-lg font-semibold text-gray-700">Total de Contas</h3>
            <h1 className="text-2xl font-bold text-gray-900">{totalAccounts}</h1>
          </div>
          <div className="relative w-32 h-32"> {/* Tamanho atualizado para w-32 h-32 */}
            <img src={numberOfAccountsImage} alt="Número de Contas" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
        {/* Total Amount */}
        <div className="bg-white p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center justify-between hover:shadow-xl hover:shadow-rose-400"> {/* Adicionando a classe hover:shadow-rose-400 */}
          <div className="info">
            <h3 className="text-lg font-semibold text-gray-700">Total em Dinheiro</h3>
            <h1 className="text-2xl font-bold text-gray-900">
                 <AnimatedCounter amount={totalCurrentBalance} /> </h1>
          </div>
          <div className="relative w-32 h-32"> {/* Tamanho atualizado para w-32 h-32 */}
            <img src={totalAmountImage} alt="Total em Dinheiro" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
