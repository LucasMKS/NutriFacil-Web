"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CampoInput } from "@/components/ui/CampoInput";
import { calcularImc } from "@/lib/api";
import { saveResult, getResult } from "@/lib/storage";

export default function IMCPage() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<{
    imc: number;
    classificacao: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPeso(getResult("peso") || "");
    setAltura(getResult("altura") || "");
  }, []);

  const handleCalcular = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const data = await calcularImc(Number(peso), Number(altura));
      setResultado(data);
      saveResult("imc_result", data);
      // Salva entradas
      saveResult("peso", peso);
      saveResult("altura", altura);
    } catch (err) {
      alert("Erro ao conectar com o backend!");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar active="/imc" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-fundo-claro dark:bg-verde-escuro">
        <Card className="max-w-md w-full shadow-md shadow-zinc-900 p-6 dark:bg-verde-mais bg-fundo-verde">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6">Cálculo de IMC</h1>
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
              <Button
                onClick={handleCalcular}
                disabled={loading || !peso || !altura}
                className="w-full"
              >
                {loading ? "Calculando..." : "Calcular IMC"}
              </Button>
              {resultado && (
                <div className="mt-4 text-center space-y-2">
                  <div className="text-xl font-semibold">
                    IMC: {resultado.imc.toFixed(2)}
                  </div>
                  <div className="text-lg">{resultado.classificacao}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
