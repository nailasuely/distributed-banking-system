// pages/add-transaction.tsx

import AddTransactionForm from '@/components/AddTransactionForm';
import HeaderBox from '@/components/HeaderBox';

const AddTransaction = () => {
  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Adicionar Transação"
        subtext="Preencha os dados para adicionar uma nova transação"
      />
      <section className="size-full pt-5">
        <AddTransactionForm />
      </section>
    </section>
  );
}

export default AddTransaction;
