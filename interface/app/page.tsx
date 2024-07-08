"use client";

import { useEffect, useState } from 'react';
import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { IP } from "@/components/IP";
import Recents from '@/components/RecentTransactions';
import Analytics from '@/components/Analytics';


const Home = () => {
  const [totalBanks, setTotalBanks] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState(0);
  const [accounts, setAccounts] = useState<{ id: string; appwriteItemId: string; name: string; balance: number; numero: string }[]>([]);
  const [onlineBanks, setOnlineBanks] = useState<{ id: string; status: string }[]>([]);
  const [user, setUser] = useState<{ $id: string; firstName: string }>({ $id: 'user123', firstName: 'Naila' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtemos os bancos para contar
        const responseBanks = await fetch(`http://${IP}/bancos_on`); 
        const bancos = await responseBanks.json();
        setOnlineBanks(bancos.map((url: string) => ({
          id: url,
          status: url.includes('5030') ? 'on' : 'off'
        })));
        setTotalBanks(bancos.length);

        // Obtemos os clientes e contas
        const responseClients = await fetch(`http://${IP}/clientes`);
        const clientes = await responseClients.json();

        // Contamos os clientes
        setTotalClients(clientes.length);

        // Contamos as contas e calculamos o saldo total
        let accountsList: { id: string; appwriteItemId: string; name: string; balance: number; numero: string }[] = [];
        let totalBalance = 0;

        for (const cliente of clientes) {
          for (const conta of cliente.contas) {
            accountsList.push({
              id: conta.numero,
              appwriteItemId: conta.numero,
              name: cliente.nome,
              balance: conta.saldo,
              numero: conta.numero
            });
            totalBalance += conta.saldo;
          }
        }

        setTotalAccounts(accountsList.length);
        setTotalCurrentBalance(totalBalance);
        setAccounts(accountsList);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox 
            type="greeting"
            title="Sistema Bancário Distribuído"
            subtext="Acesse e gerencie sua conta e transações."
          />
          <Analytics
            totalClients={totalClients}
            totalAccounts={totalAccounts}
            totalCurrentBalance={totalCurrentBalance}/>

        </header>
        <Recents
      />
      </div>

      

      <RightSidebar 
        user={user}
        banks={accounts}
        onlineBanks={onlineBanks}
      />
    </section>
  );
};

export default Home;
