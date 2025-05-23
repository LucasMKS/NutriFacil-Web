import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const calcularImc = async (peso: number, altura: number) => {
  const resp = await axios.post(`${API_URL}/imc/calcular`, { peso, altura });
  return resp.data;
};

export const calcularTmb = async (
  peso: number,
  altura: number,
  idade: number,
  sexo: string
) => {
  const resp = await axios.post(`${API_URL}/tmb/calcular`, {
    peso,
    altura,
    idade,
    sexo,
  });
  return resp.data;
};

export const calcularAgua = async (peso: number) => {
  const resp = await axios.post(`${API_URL}/agua/calcular`, { peso });
  return resp.data;
};

export const recomendarDieta = async (requisicao: any) => {
  const resp = await axios.post(`${API_URL}/dieta/recomendar`, requisicao);
  console.log("Resposta da API:", resp.data);
  return resp.data;
};
