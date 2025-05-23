"use client";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calcularAgua } from "@/lib/api";
import { saveResult } from "@/lib/storage";

export default function AguaPage() {
  const [peso, setPeso] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalcular = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const data = await calcularAgua(Number(peso));
      setResultado(data.litrosPorDia);
      saveResult("agua_result", data.litrosPorDia);
    } catch (err) {
      alert("Erro ao conectar com o backend!");
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar active="/agua" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <Card className="max-w-md w-full shadow-xl p-6">
          <CardContent>
            <h1 className="text-2xl font-bold mb-6">Consumo Diário de Água</h1>
            <div className="space-y-4">
              <div>
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input
                  id="peso"
                  type="number"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  placeholder="Ex: 70"
                />
              </div>
              <Button
                onClick={handleCalcular}
                disabled={loading || !peso}
                className="w-full"
              >
                {loading ? "Calculando..." : "Calcular"}
              </Button>
              {resultado !== null && (
                <div className="mt-4 text-center space-y-2">
                  <div className="text-xl font-semibold">
                    Recomendado: {resultado.toFixed(2)} litros/dia
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
