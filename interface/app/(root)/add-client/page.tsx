// pages/add-client.tsx

"use client";

import HeaderBox from '@/components/HeaderBox'
import AddClientForm from '@/components/AddClientForm'



const AddClient = () => {
  return (
    <section className="payment-transfer">
      <HeaderBox 
        title="Adicionar Cliente"
        subtext="Preencha as informações abaixo para adicionar um novo cliente ao banco"
      />

      <section className="size-full pt-5">
        <AddClientForm/>
      </section>
    </section>
  )
}

export default AddClient
