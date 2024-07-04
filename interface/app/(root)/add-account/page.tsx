// pages/add-account.tsx

"use client";

import HeaderBox from '@/components/HeaderBox'
import AddAccountForm from '@/components/AddAccountForm'

const AddAccount = () => {
  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Adicionar Conta"
        subtext="Preencha as informações abaixo para adicionar uma nova conta ao banco"
      />

      <section className="size-full pt-5">
        <AddAccountForm />
      </section>
    </section>
  )
}

export default AddAccount
