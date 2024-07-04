// lib/actions/bank.actions.ts
import { IP } from "@/components/IP";

export const getBancos = async () => {
  try {
    const response = await fetch('http://${IP}/bancos_on');
    if (!response.ok) {
      throw new Error(`Erro ao obter bancos: ${response.statusText}`);
    }
    const bancos = await response.json();
    return bancos;
  } catch (error) {
    console.error('Erro ao buscar bancos:', error);
    return [];
  }
};
