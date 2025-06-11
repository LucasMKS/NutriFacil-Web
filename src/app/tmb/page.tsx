"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampoInput } from "@/components/ui/CampoInput";
import { CampoSelect } from "@/components/ui/CampoSelect";
import { calcularTmb } from "@/lib/api";
import { saveResult, getResult } from "@/lib/storage";

function validarDados(
  peso: string,
  altura: string,
  idade: string,
  sexo: string
) {
  const erros: string[] = [];

  const pesoNum = Number(peso);
  const alturaNum = Number(altura);
  const idadeNum = Number(idade);

  if (!peso || pesoNum < 20 || pesoNum > 300) {
    erros.push("Peso deve estar entre 20kg e 300kg.");
  }

  if (!altura || alturaNum < 0.5 || alturaNum > 2.5) {
    erros.push("Altura deve estar entre 0.5m e 2.5m.");
  }

  if (!idade || idadeNum < 5 || idadeNum > 120) {
    erros.push("Idade deve estar entre 5 e 120 anos.");
  }

  if (!sexo) {
    erros.push("Selecione o sexo.");
  }

  return erros;
}

export default function TMBPage() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPeso(getResult("peso") || "");
    setAltura(getResult("altura") || "");
    setIdade(getResult("idade") || "");
    setSexo(getResult("sexo") || "");
  }, []);

  const handleCalcular = async () => {
    const erros = validarDados(peso, altura, idade, sexo);

    if (erros.length > 0) {
      alert(erros.join("\n"));
      return;
    }

    setLoading(true);
    setResultado(null);
    try {
      const data = await calcularTmb(
        Number(peso),
        Number(altura) * 100,
        Number(idade),
        sexo
      );
      setResultado(data.tmb);
      saveResult("tmb_result", data.tmb);
      // Salvar entradas
      saveResult("peso", peso);
      saveResult("altura", altura);
      saveResult("idade", idade);
      saveResult("sexo", sexo);
    } catch (err) {
      alert("Erro ao conectar com o backend!");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar active="/tmb" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-fundo-claro dark:bg-verde-escuro">
        <Card className="max-w-md w-full p-6 shadow-md shadow-zinc-900 dark:bg-verde-mais bg-fundo-verde">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6">Cálculo de TMB</h1>
            <div className="space-y-4">
              <CampoInput
                id="peso"
                label="Peso (kg)"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Ex: 70"
              />
              <CampoInput
                id="altura"
                label="Altura (m)"
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                step="0.01"
                placeholder="Ex: 1.75"
              />
              <CampoInput
                id="idade"
                label="Idade (anos)"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Ex: 25"
              />
              <CampoSelect
                id="sexo"
                label="Sexo"
                value={sexo}
                onChange={setSexo}
                placeholder="Selecione o sexo"
                options={[
                  { label: "Masculino", value: "M" },
                  { label: "Feminino", value: "F" },
                ]}
              />
              <Button
                onClick={handleCalcular}
                disabled={loading || !peso || !altura || !idade || !sexo}
                className="w-full"
              >
                {loading ? "Calculando..." : "Calcular TMB"}
              </Button>
              {resultado !== null && (
                <div className="mt-4 text-center space-y-2">
                  <div className="text-xl font-semibold">
                    TMB: {resultado.toFixed(2)} kcal/dia
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
