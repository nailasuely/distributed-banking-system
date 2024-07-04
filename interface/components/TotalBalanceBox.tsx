
import AnimatedCounter from './AnimatedCounter';

interface TotalBalanceBoxProps {
  accounts: { id: string; appwriteItemId: string; name: string; balance: number; numero: string }[];
  totalBanks: number; // Quantidade de bancos
  totalClients: number; // Quantidade de clientes
  totalAccounts: number; // Quantidade de contas
  totalCurrentBalance: number; // Saldo total
}

const TotalBalanceBox = ({
  accounts = [],
  totalBanks,
  totalClients,
  totalAccounts,
  totalCurrentBalance
}: TotalBalanceBoxProps) => {
  return (
    <section className="total-balance">
      <div className="total-balance-chart">
        <img src="/icons/perfil.svg" alt="Balance Chart" className="w-full h-auto" />
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="header-2">
          Contas Bancárias: {totalAccounts}
        </h2>
        <p className="text-14 text-gray-600">
          Quantidade de Clientes: {totalClients}
        </p>
        <div className="flex flex-col gap-2">
          <p className="total-balance-label">
            Total de dinheiro
          </p>

          <div className="total-balance-amount flex-center gap-2">
            <AnimatedCounter amount={totalCurrentBalance} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TotalBalanceBox;
