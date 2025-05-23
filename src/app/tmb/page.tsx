"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { calcularTmb } from "@/lib/api";
import { saveResult, getResult } from "@/lib/storage";

export default function TMBPage() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPeso(getResult("peso") || "");
    setAltura(
      getResult("altura") ? (Number(getResult("altura")) * 100).toString() : ""
    );
    setIdade(getResult("idade") || "");
    setSexo(getResult("sexo") || "");
  }, []);

  const handleCalcular = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const data = await calcularTmb(
        Number(peso),
        Number(altura),
        Number(idade),
        sexo
      );
      setResultado(data.tmb);
      saveResult("tmb_result", data.tmb);
      // Salvar entradas
      saveResult("peso", peso);
      saveResult("altura", (Number(getResult("altura")) / 100).toString());
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
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ex: 70"
                  className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                />
              </div>
              <div>
                <Label htmlFor="altura">Altura (cm)</Label>
                <Input
                  id="altura"
                  type="number"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  placeholder="Ex: 175"
                  className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                />
              </div>
              <div>
                <Label htmlFor="idade">Idade (anos)</Label>
                <Input
                  id="idade"
                  type="number"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Ex: 25"
                  className="dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800"
                />
              </div>
              <div>
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={sexo} onValueChange={setSexo}>
                  <SelectTrigger className="w-full dark:bg-verde-escuro shadow-md shadow-zinc-800 border border-zinc-600 dark:border-zinc-800">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Masculino</SelectItem>
                    <SelectItem value="F">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
