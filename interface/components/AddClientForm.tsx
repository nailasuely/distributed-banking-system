// components/AddClientForm.tsx

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IP } from "./IP";

import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = z.object({
  banco: z.string().min(1, "Selecione um banco"),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos").regex(/^\d+$/, "O CPF deve conter apenas números"),
  nome: z.string().min(1, "O nome é obrigatório"),
  tipo: z.string().min(1, "Selecione o tipo de conta"),
});

const AddClientForm = ({ bancos }: { bancos: { id: string; nome: string }[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      nome: "",
      tipo: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      await fetch(`http://${IP}/criar_cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: data.cpf,
          nome: data.nome,
          tipo: data.tipo,
        }),
      });

      form.reset();
      router.push("/");
    } catch (error) {
      console.error("Falha ao criar o cliente: ", error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Nome do Cliente
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Informe o nome completo do cliente
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Nome do Cliente"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    CPF do Cliente
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Informe o CPF do cliente (11 dígitos)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="CPF do Cliente"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Tipo de Conta
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Selecione o tipo de conta do cliente
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <select {...field} className="input-class">
                      <option value="">Selecione o tipo de conta</option>
                      <option value="corrente">Física</option>
                      <option value="poupanca">Juridíca</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Enviando...
              </>
            ) : (
              "Adicionar Cliente"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddClientForm;