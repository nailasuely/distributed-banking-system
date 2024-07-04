export const createClient = async (data: { cpf: string, nome: string, tipo: string, banco: string }) => {
    const response = await fetch("http://ip:porta/criar_cliente", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {      throw new Error("Falha ao criar cliente");
    }
  
    return response.json();
  };
  