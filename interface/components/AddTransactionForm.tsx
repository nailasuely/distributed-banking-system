"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";

import { Button } from "./ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { getBancos } from "@/lib/actions/bank.actions";
import { IP } from "./IP";

const participantSchema = z.object({
  banco: z.string().min(1, "Selecione um banco"),
  cpf: z.string().length(11, "O CPF deve ter 11 dígitos").regex(/^\d+$/, "O CPF deve conter apenas números"),
  numero: z.string().min(1, "O número da conta é obrigatório"),
  valor: z.string().optional().refine((val) => val === undefined || !isNaN(parseFloat(val)), {
    message: "O valor deve ser um número",
  }),
});

const formSchema = z.object({
  participantes: z.array(participantSchema).min(2, "Adicione pelo menos dois participantes"),
});

const AddTransactionForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bancos, setBancos] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const bancos = await getBancos();
        setBancos(bancos);
      } catch (error) {
        console.error("Erro ao obter bancos:", error);
        setFeedback({ type: "error", message: "Não foi possível carregar a lista de bancos." });
      }
    };
    fetchBancos();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      participantes: [{ banco: "", cpf: "", numero: "", valor: "" }, { banco: "", cpf: "", numero: "", valor: "0" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participantes",
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setFeedback(null); 

    try {
      const participantes = data.participantes.map((p, index) => ({
        banco: parseInt(p.banco),
        cpf: p.cpf,
        numero: p.numero,
        valor: index === data.participantes.length - 1 ? 0 : parseFloat(p.valor || "0"),
      }));

      const response = await fetch(`http://${IP}/transferencia_composta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantes }),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.statusText}`);
      }

      form.reset();
      router.push("/");
      setFeedback({ type: "success", message: "Transação realizada com sucesso!" });
      
      setTimeout(() => {
        form.reset();
        router.push("/");
      }, 2000);

    } catch (error) {
      console.error("Falha ao criar a transação: ", error);
      setFeedback({ type: "error", message: "Falha ao realizar a transação. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Participantes da Transação
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Preencha os detalhes de cada participante da transação
          </p>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="border-b border-gray-200 py-4">
            <FormField
              control={form.control}
              name={`participantes.${index}.banco`}
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-6 pt-5">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="text-14 font-medium text-gray-700">
                        Selecione o Banco
                      </FormLabel>
                      <FormDescription className="text-12 font-normal text-gray-600">
                        Selecione o banco do participante {index + 1}
                      </FormDescription>
                    </div>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <select {...field} className="input-class">
                          <option value="">Selecione um banco</option>
                          {bancos.map((banco, bancoIndex) => (
                            <option key={bancoIndex} value={bancoIndex.toString()}>
                              {banco}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`participantes.${index}.cpf`}
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-6 pt-5">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="text-14 font-medium text-gray-700">
                        CPF do Participante
                      </FormLabel>
                      <FormDescription className="text-12 font-normal text-gray-600">
                        Informe o CPF do participante {index + 1}
                      </FormDescription>
                    </div>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="CPF do participante"
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
              name={`participantes.${index}.numero`}
              render={({ field }) => (
                <FormItem className="border-t border-gray-200">
                  <div className="payment-transfer_form-item pb-6 pt-5">
                    <div className="payment-transfer_form-content">
                      <FormLabel className="text-14 font-medium text-gray-700">
                        Número da Conta
                      </FormLabel>
                      <FormDescription className="text-12 font-normal text-gray-600">
                        Informe o número da conta do participante {index + 1}
                      </FormDescription>
                    </div>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          placeholder="Número da conta"
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
            {index < fields.length - 1 && (
              <FormField
                control={form.control}
                name={`participantes.${index}.valor`}
                render={({ field }) => (
                  <FormItem className="border-t border-gray-200">
                    <div className="payment-transfer_form-item pb-6 pt-5">
                      <div className="payment-transfer_form-content">
                        <FormLabel className="text-14 font-medium text-gray-700">
                          Valor da Transação
                        </FormLabel>
                        <FormDescription className="text-12 font-normal text-gray-600">
                          Informe o valor para o participante {index + 1}
                        </FormDescription>
                      </div>
                      <div className="flex w-full flex-col">
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Valor"
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
            <div className="flex justify-end mt-4">
              {fields.length > 2 && index < fields.length - 1 && (
                <Button type="button" onClick={() => remove(index)} className="mr-2">
                  Remover
                </Button>
              )}
              {index === fields.length - 1 && (
                <Button type="button" onClick={() => append({ banco: "", cpf: "", numero: "", valor: "0" })}>
                  Adicionar Participante
                </Button>
              )}
            </div>
          </div>
        ))}

        <div className="payment-transfer_btn-box mt-4">
          <Button type="submit" className="payment-transfer_btn">
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; Enviando...
              </>
            ) : (
              "Fazer Transação"
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

export default AddTransactionForm;
