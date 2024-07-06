// pages/add-account.tsx
import React from 'react';
import HeaderBox from '@/components/HeaderBox';
import AddAccountForm from '@/components/AddAccountForm';

const AddAccount: React.FC = () => {
  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Adicionar Conta"
        subtext="Preencha as informações abaixo para adicionar uma nova conta ao banco"
        // Remova o prop 'user' daqui
      />

      <section className="size-full pt-5">
        <AddAccountForm />
      </section>
    </section>
  );
};

export default AddAccount;
