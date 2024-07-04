"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { IP } from "./IP";

// Definindo o esquema de validação com zod
const formSchema = z.object({
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos").regex(/^\d+$/, "O CPF deve conter apenas números"),
  nome: z.string().min(1, "O nome é obrigatório"),
  tipo: z.enum(["Fisica", "Juridica"], {
    errorMap: () => ({ message: "Tipo inválido. Deve ser 'Física' ou 'Jurídica'" }),
  }),
});

const AddClientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Configuração do useForm com zodResolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
      nome: "",
      tipo: "Fisica",
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;


  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setFeedback(null); 

    try {
      const response = await fetch(`http://${IP}/criar_cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      form.reset();
      router.push("/");
      setFeedback({ type: "success", message: "Cliente adicionado com sucesso!" });

      setTimeout(() => {
        form.reset();
        router.push("/");
      }, 2000);

    } catch (error) {
      console.error("Falha ao adicionar o cliente: ", error);
      setFeedback({ type: "error", message: "Falha ao adicionar o cliente. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submit)} className="flex flex-col">
        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Adicionar Cliente
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Preencha os detalhes do novo cliente
          </p>
        </div>

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
                    Informe o CPF do cliente
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="CPF do cliente"
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
                      placeholder="Nome do cliente"
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
                    Tipo de Cliente
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Selecione o tipo de cliente (Física ou Jurídica)
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <select {...field} className="input-class">
                      <option value="Fisica">Física</option>
                      <option value="Juridica">Jurídica</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box mt-4">
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
        {feedback && (
          <div className={`mt-4 text-center text-14 ${feedback.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {feedback.message}
          </div>
        )}
      </form>
    </Form>
  );
};

export default AddClientForm;
