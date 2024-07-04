"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

// Define o esquema de validação usando zod
const formSchema = z.object({
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos").regex(/^\d+$/, "O CPF deve conter apenas números"),
  numero: z.string().min(1, "O número da conta é obrigatório"),
  saldo_inicial: z.string().min(1, "O saldo inicial é obrigatório").refine((val) => !isNaN(parseFloat(val)), {
    message: "O saldo inicial deve ser um número",
  }),
  conjunta: z.boolean().optional(),
  titular2: z.string().length(11, "O CPF do segundo titular deve ter 11 dígitos").regex(/^\d+$/, "O CPF do segundo titular deve conter apenas números").optional(),
});

const AddAccountForm = ({ bancos }: { bancos: { id: string; nome: string }[] }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      numero: "",
      saldo_inicial: "0",
      conjunta: false,
      titular2: "",
    },
  });

  const { watch, setValue } = form;
  const isConjunta = watch("conjunta");

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Cria a lista de titulares com o CPF do primeiro titular
      const titulares = [data.cpf];

      // Adiciona o CPF do segundo titular se a conta for conjunta
      if (data.conjunta && data.titular2) {
        titulares.push(data.titular2);
      }

      // Faz a requisição para adicionar a conta
      const response = await fetch(`http://localhost:5000/criar_conta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: data.cpf,
          numero: data.numero,
          saldo_inicial: parseFloat(data.saldo_inicial), // Converte o saldo inicial para número
          conjunta: data.conjunta || false,  // Adiciona a flag de conta conjunta
          titulares,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      form.reset();
      router.push("/");
    } catch (error) {
      console.error("Falha ao criar a conta: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
      
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    CPF do Titular
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Informe o CPF do titular da conta (11 dígitos)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="CPF do Titular"
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
          name="numero"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Número da Conta
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Informe o número da nova conta
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Número da Conta"
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
          name="saldo_inicial"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Saldo Inicial
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Informe o saldo inicial da conta
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Saldo Inicial"
                      className="input-class"
                      {...field}
                      onChange={(e) => setValue('saldo_inicial', e.target.value)}
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
          name="conjunta"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Conta Conjunta
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Selecione se esta é uma conta conjunta
                  </FormDescription>
                </div>
                <div className="flex w-full items-center">
                  <Controller
                    control={form.control}
                    name="conjunta"
                    render={({ field: { onChange, onBlur, value, name, ref } }) => (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          onChange={(e) => onChange(e.target.checked)}
                          onBlur={onBlur}
                          checked={value}
                          name={name}
                          ref={ref}
                          className="mr-2"
                        />
                        Conta conjunta
                      </label>
                    )}
                  />
                </div>
              </div>
            </FormItem>
          )}
        />

        {isConjunta && (
          <FormField
            control={form.control}
            name="titular2"
            render={({ field }) => (
              <FormItem className="border-t border-gray-200">
                <div className="payment-transfer_form-item pb-6 pt-5">
                  <div className="payment-transfer_form-content">
                    <FormLabel className="text-14 font-medium text-gray-700">
                      CPF do Segundo Titular
                    </FormLabel>
                    <FormDescription className="text-12 font-normal text-gray-600">
                      Informe o CPF do segundo titular da conta
                    </FormDescription>
                  </div>
                  <div className="flex w-full flex-col">
                    <FormControl>
                      <Input
                        placeholder="CPF do Segundo Titular"
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
        )}

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Enviando...
              </>
            ) : (
              "Adicionar Conta"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddAccountForm;